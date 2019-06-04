#!/bin/bash
nohup bin/communication-service &
echo $! > pid