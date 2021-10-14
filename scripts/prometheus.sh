#!/usr/bin/env nix-shell
#!nix-shell -i bash -p prometheus
#!nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz

# https://search.nixos.org/packages?channel=unstable&show=prometheus

# Have subshell in this script's folder
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
(
	cd "${SCRIPTS_DIR}" || exit 1

	# Run prometheus on port 9090
	prometheus
)
