#!/bin/bash

mkdir -p albums/$(./bin/uuid_v4 | tee >( tee >&2 ) )
