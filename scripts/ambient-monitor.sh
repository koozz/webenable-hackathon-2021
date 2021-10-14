#!/usr/bin/env nix-shell
#!nix-shell -i bash -p go_1_17
##  #!nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz

# https://search.nixos.org/packages?channel=unstable&show=go

# Have subshell in project's root folder
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
(
	cd "${SCRIPTS_DIR}/.." || exit 1

	go mod tidy
	go mod download
	go run ./main.go
)
