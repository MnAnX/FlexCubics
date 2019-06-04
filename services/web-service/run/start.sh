#!/bin/bash
nohup bin/web-service &
echo $! > pid