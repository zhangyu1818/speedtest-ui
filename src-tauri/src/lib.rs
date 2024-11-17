pub mod models;

use std::io::{BufRead, BufReader, Write};
use std::process::{Command, Stdio};
use std::thread;
use tauri::{path::BaseDirectory, AppHandle, Emitter, Manager};

#[tauri::command]
async fn run_speedtest(app: AppHandle) -> Result<bool, String> {
    let binary_name = if cfg!(target_os = "windows") {
        "speedtest.exe"
    } else {
        "speedtest"
    };

    let binary_path = format!("resources/bin/{}", binary_name);

    let command_path = app
        .path()
        .resolve(dbg!(binary_path), BaseDirectory::Resource)
        .map_err(|e| format!("Failed to resolve resource path: {}", e))?;

    let mut child = Command::new(command_path)
        .arg("--format=json")
        .arg("--progress=yes")
        .arg("--unit=B/s")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    if let Some(mut stdin) = child.stdin.take() {
        thread::spawn(move || {
            stdin.write_all(b"y\n").unwrap();
        });
    }

    let stdout = child
        .stdout
        .take()
        .ok_or_else(|| "Failed to capture stdout")?;

    let stderr = child
        .stderr
        .take()
        .ok_or_else(|| "Failed to capture stderr")?;

    thread::spawn(move || {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            match line {
                Ok(content) => {
                    println!("{}", content);
                    let event: models::TestEvent = serde_json::from_str(&content).unwrap();
                    app.emit("speedtest", &event).unwrap();
                }
                Err(e) => eprintln!("[STDOUT ERROR] {}", e),
            }
        }
    });

    thread::spawn(move || {
        let reader = BufReader::new(stderr);
        for line in reader.lines() {
            match line {
                Ok(content) => eprintln!("[STDERR] {}", content),
                Err(e) => eprintln!("[STDERR ERROR] {}", e),
            }
        }
    });

    let status = child.wait().map_err(|e| e.to_string())?;
    println!("Process exited with status: {}", status);

    Ok(status.success())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![run_speedtest])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
