#!/usr/bin/env nix-shell
#!nix-shell -i bash -p prometheus-node-exporter
#!nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz

# https://search.nixos.org/packages?channel=unstable&show=prometheus-node-exporter

# Have subshell in this script's folder
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
(
	cd "${SCRIPTS_DIR}" || exit 1

	# Run the prometheus node exporter on port 9100
	node_exporter
)
