mod lambda_gateway;

use std::error::Error;

use lambda_gateway::{LambdaRequest, LambdaResponse, LambdaResponseBuilder};
use lambda_runtime::{error::HandlerError, lambda, Context};
use log::{self, error};
use serde_derive::{Deserialize, Serialize};
use simple_logger;

#[derive(Deserialize)]
struct MessageEventRequest {
    #[serde(rename = "name")]
    name: String,
}

#[derive(Serialize)]
struct MessageEventResponse {
    message: String,
}

fn main() -> Result<(), Box<dyn Error>> {
    simple_logger::init_with_level(log::Level::Debug)?;
    lambda!(my_handler);

    Ok(())
}

fn my_handler(
    e: LambdaRequest<MessageEventRequest>,
    c: Context,
) -> Result<LambdaResponse, HandlerError> {
    let payload = e.body();
    let name = &payload.name;

    if name == "" {
        let message = format!("Empty name in request {}", c.aws_request_id);
        error!("{}", message); // TODO
        return LambdaResponseBuilder::new().bad_request(&message).build();
    }

    LambdaResponseBuilder::new()
        .with_status(200)
        .with_json(MessageEventResponse {
            message: format!("Hi, '{}'!", name),
        })
        .build()
}
