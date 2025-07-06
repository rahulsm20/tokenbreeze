#!/bin/bash
cd ./server && bun dev &
cd ./client && bun dev &
wait