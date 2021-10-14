# Ambient monitor

* Monitoring network traffic on a port.
* Playing ambient sound based on the traffic.

Requirements handled by Nix:

* [Nix package manager](https://nixos.org/download.html).

## Monitoring a system

Choice: prometheus-node-exporter

Runs a Prometheus node_exporter,
[exposing metrics on port 9100](http://localhost:9100).

```bash
scripts/node-exporter.sh
```

### Prometheus (metrics scraping)

Prometheus to [scraping metrics](http://localhost:9090) from the node.

With metrics like:

* [total received network packets](http://localhost:9090/graph?g0.expr=node_network_receive_packets_total%7Bdevice%3D%22wlp0s20f3%22%7D&g0.tab=0&g0.stacked=0&g0.range_input=1h).
* [increase in packets over 2m](http://localhost:9090/graph?g0.expr=increase(node_network_receive_packets_total%7Bdevice%3D%22wlp0s20f3%22%7D%5B2m%5D)&g0.tab=0&g0.stacked=0&g0.range_input=15m)


```bash
scripts/prometheus.sh
```

## Audio based on monitoring

Go application, serving static web content and providing an endpoint that
returns the '[audio-params](http://localhost:9000/audio-params)' to use.

Iterative attempts:

* v1: random integer for BPM
* v2: query prometheus and translate to BPM

```bash
scripts/ambient-monitor.sh
```

### Interesting metrics

* `node_network_receive_bytes_total{device="wlp0s20f3"} 9.30349675e+08`
* `node_network_receive_errs_total{device="wlp0s20f3"} 0`
* `node_network_receive_packets_total{device="wlp0s20f3"} 633263`
* `node_network_transmit_bytes_total{device="wlp0s20f3"} 1.4333448e+07`
* `node_network_transmit_errs_total{device="wlp0s20f3"} 0`
* `node_network_transmit_packets_total{device="wlp0s20f3"} 113194`

### Interesting sound sites

* http://labs.dinahmoe.com/plink/
