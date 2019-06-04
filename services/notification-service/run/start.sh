#!/bin/bash
nohup bin/notification-service &
echo $! > pid
