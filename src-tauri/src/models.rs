use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum TestEvent {
    TestStart {
        timestamp: String,
        server: Server,
    },
    Ping {
        timestamp: String,
        ping: Ping,
    },
    Download {
        timestamp: String,
        download: Speed,
    },
    Upload {
        timestamp: String,
        upload: Speed,
    },
    Result {
        timestamp: String,
        download: Result,
        upload: Result,
    },
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Server {
    id: u32,
    name: String,
    location: String,
    country: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Ping {
    jitter: f64,
    latency: f64,
    progress: f64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Speed {
    bandwidth: u32,
    bytes: u64,
    elapsed: u64,
    progress: f64,
    latency: Option<LatencyInfo>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LatencyInfo {
    iqm: Option<f64>,
    low: Option<f64>,
    high: Option<f64>,
    jitter: Option<f64>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Result {
    bandwidth: u64,
    bytes: u64,
    elapsed: u64,
    latency: LatencyInfo,
}
