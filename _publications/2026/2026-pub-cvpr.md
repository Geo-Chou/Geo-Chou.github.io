---
title:          "Rascene: High-Fidelity 3D Scene Imaging with mmWave Communication Signals"
date:           2026-02-21 00:01:30 -0500
selected:       true
pub:            "CVPR (Accepted)"
pub_date:       "2026"
abstract: >-
  Robust 3D environmental perception is critical for applications like autonomous navigation and robotics, yet existing optical sensors like cameras and LiDAR fail in adverse conditions such as smoke, fog, and non-ideal lighting. While specialized radar systems can operate in these conditions, their reliance on bespoke, ultra-wideband hardware and licensed spectrum limits their scalability and cost-effectiveness. This paper introduces Rascene, a novel framework that enables high-fidelity 3D imaging by repurposing ubiquitous mmWave OFDM communication signals. Recognizing that a single-frame RF signal is inherently sparse, noisy, and highly ambiguous, the key innovation of Rascene is a multi-frame 3D imaging framework designed to fuse information from signals captured across multiple, arbitrary poses. This framework leverages a spatially adaptive fusion mechanism to find geometric consensus across the multiple views, effectively suppressing multipath artifacts while preserving sparse geometric details. Experiments demonstrate that our method reconstructs 3D scenes with high precision, providing a new pathway for low-cost, scalable, and robust 3D perception.
cover:          /assets/images/covers/2026_cvpr_cover.png
authors:
- KunZhe Song
- Geo Jie Zhou
- Xiaoming Liu
- Huacheng Zeng
links:
  Paper: https://arxiv.org/

citation: |
  @inproceedings{zhou2026rascene,
    title={Rascene: High-Fidelity 3D Scene Imaging with mmWave Communication Signals},
    author={Song, KunZhe and Zhou, Geo Jie and Liu, Xiaoming and Zeng, Huacheng},
    booktitle={IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)},
    year={2026}
  }

---

Rascene pushes mmWave sensing toward photorealistic 3D reconstructions. 

## Demo Video:
<div class="embed-responsive embed-responsive-16by9 mb-3">
<video class="embed-responsive-item" controls preload="metadata" poster="/assets/images/covers/2026_cvpr_cover.png">
  <source src="/assets/videos/2025-cvpr.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
</div>