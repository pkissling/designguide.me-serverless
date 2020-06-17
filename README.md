# designguide.me-serverless
[![Build Status](https://travis-ci.org/pkissling/designguide.me-serverless.svg?branch=master)](https://travis-ci.org/pkissling/designguide.me-serverless)

# Description
[Serverless](https://www.serverless.com/) project contaning the backend implementation for [designguide.me](https://designguide.me) using [AWS Lambda](https://aws.amazon.com/lambda/) functions written in [Rust](https://www.rust-lang.org/).

# Prerequisites

## Custom domain name
Serverless registers a *custom domain name* to expose the API through a custom domain.
The corresponding Route53 and ACM (Certificate) configuration is bootstrapped in [designguide.me-terraform](https://github.com/pkissling/designguide.me-terraform) and ist required to make the custom domain publicly available.

## AWS access
AWS credentials with sufficient permission must be [setup](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).
The corresponding IAM user / policy used for this project is also managed in [designguide.me-terraform](https://github.com/pkissling/designguide.me-terraform/blob/master/iam/serverless.tf)

## Installation

  ```
  $ make
  ```