---
title:          "SOPAR: Bee Localization and Tracking Using RF Sub-harmonic Oscillating Parametric Resonator in Hive Environments"
date:           2026-06-15 00:01:30 -0500
selected:       false
pub:            "Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies (UbiComp)"
pub_date:       "2026"
abstract: >-
  Honey bees play a vital role in global agriculture. Understanding the movement of a queen bee within a hive box is essential for advancing both biological research and practical apiculture. In this paper, we present SOPAR, a novel Radio Frequency (RF) Sub-harmonic Oscillating Parametric Resonator designed for non-invasive localization and tracking of a queen bee inside a full-size hive box. The core component of SOPAR is a lightweight RF backscatter tag that can be attached to a bee's thorax without affecting its normal behavior. The tag comprises two passive resonators: (i) an inner spiral inductor bridged by a varactor diode and (ii) an outer circular inductor with a gap bridged by a chip capacitor. The outer inductor harvests energy from the external excitation signal, driving the oscillation of the inner spiral resonator to produce sub-harmonic backscattered signals at half the excitation frequency. The frequency separation between excitation and backscatter signals eliminates self-interference at the RF reader, significantly improving signal-to-noise ratio (SNR) and detection range. The layout of the two resonators is meticulously optimized to maximize magnetic coupling, thereby minimizing the overall tag size. Building on this dual-resonator tag, we design an RF reader with a Bayesian estimation algorithm that localizes the tagged bee by exploiting the spatio-temporal characteristics of the sub-harmonic backscattered signals. We have built a prototype of SOPAR, featuring a tag with a diameter of only 3.7 mm and a weight of less than 10 mg. Extensive experiments demonstrate that SOPAR achieves a median localization error of 3.7 cm when tracking a queen bee in a full-size hive box. Moreover, the results confirm that SOPAR remains robust under diverse environmental conditions.
cover:          /assets/images/covers/2026_ubicomp_cover.png
authors:
- Qijun Wang
- Peihao Yan
- Geo Jie Zhou
- Xiang Liu
- Dan Stanley
- Chunqi Qian
- Huacheng Zeng
links:
  Paper: https://dl.acm.org/doi/10.1145/3810192

citation: |
  @article{10.1145/3810192,
  author = {Wang, Qijun and Yan, Peihao and Zhou, Geo Jie and Liu, Xiang and Stanley, Dan and Huang, Zach and Qian, Chunqi and Zeng, Huacheng},
  title = {SOPAR: Bee Localization and Tracking Using RF Sub-harmonic Oscillating Parametric Resonator in Hive Environments},
  year = {2026},
  issue_date = {June 2026},
  publisher = {Association for Computing Machinery},
  address = {New York, NY, USA},
  volume = {10},
  number = {2},
  url = {https://doi.org/10.1145/3810192},
  doi = {10.1145/3810192},
  journal = {Proc. ACM Interact. Mob. Wearable Ubiquitous Technol.},
  month = jun,
  articleno = {63},
  numpages = {20},
  keywords = {Bee, localization, tracking, backscatter tag, RF sensing, sub-harmonic oscillator, parametric resonator}
  }

---