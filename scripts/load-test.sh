#!/usr/bin/env nix-shell
#!nix-shell -i bash -p hey
#!nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz

# https://search.nixos.org/packages?channel=unstable&show=hey

# Have subshell in this script's folder
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
(
	cd "${SCRIPTS_DIR}" || exit 1

	# Generate some load
	hey -n 2000000 -m GET http://localhost:9000/sounds/kick.wav
)
