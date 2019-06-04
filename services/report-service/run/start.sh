#!/bin/bash
nohup bin/report-service &
echo $! > pid