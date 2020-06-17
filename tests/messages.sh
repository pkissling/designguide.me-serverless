#!/bin/bash

# From: https://coderwall.com/p/nsso8w/using-shell-script-to-test-your-server

URL='https://dev-api.designguide.me'

## Unit-Testable Shell Scripts (http://eradman.com/posts/ut-shell-scripts.html)
typeset -i tests_run=0
function try { this="$1"; }
trap 'printf "$0: exit code $? on line $LINENO\nFAIL: $this\n"; exit 1' ERR
function assert {
    let tests_run+=1
    [ "$1" = "$2" ] && { echo -n "."; return; }
    printf "\nFAIL: $this\n'$1' != '$2'\n"; exit 1
}
## end

###############################################################

# Test 1
try "Hello world"
random=$(uuidgen)
out=$(curl -X POST $URL/v1/messages -d "{\"name\" : \"$random\" }")
assert "{\"message\":\"Hello, $random!\"}" "$out"

###############################################################
echo
echo "PASS: $tests_run tests run"