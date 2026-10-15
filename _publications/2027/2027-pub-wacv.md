---
title:          "RadPose: ISAC-based RF 3D Human Pose Estimation"
date:           2026-10-16 00:01:30 -0500
selected:       true
pub:            "The IEEE/CVF Winter Conference on Applications of Computer Vision (WACV)"
pub_date:       "2027"
abstract: >-
  Human pose estimation under adverse lighting and occlusion conditions remains challenging for camera- and LiDAR-based systems. Although mmWave radars provide robustness to illumination and occlusion, they rely on dedicated hardware and licensed spectrum, limiting scalability. In this paper, we present RadPose, a learning-based monostatic integrated sensing and communication (ISAC) framework that enables commodity mmWave communication devices to perform 3D human pose estimation. Unlike specialized radars, RadPose leverages monostatic full-duplex operation to extract channel impulse responses (CIRs) directly from standard OFDM communication signals, generating 3D radio point clouds without additional sensing hardware. To address the sparsity and noise of RF observations, RadPose employs a cross-frame transformer-based pose inference network with semantic-guided spatial attention and target-driven temporal attention for robust spatio-temporal aggregation. It further adopts a joint-aware inverse kinematics refinement module based on graph convolution to enforce skeletal topology, bone-length consistency, and anatomical plausibility. Extensive experiments demonstrate RadPose achieves competitive accuracy compared to state-of-the-art radar-based approaches while maintaining robust performance in unseen and occluded scenarios.
cover:          /assets/images/covers/2027_radpose_cover.png
authors:
- Geo Jie Zhou
- KunZhe Song
- Ruxin Lin
- Huacheng Zeng
# links:
#   Paper: https://arxiv.org/abs/2604.02603

citation: |
  @inproceedings{zhou2026radpose,
    title={RadPose: ISAC-based RF 3D Human Pose Estimation},
    author={Zhou, Geo Jie and Song, Kunzhe and Lin, Ruxin and Zeng, Huacheng},
    booktitle={The IEEE/CVF Winter Conference on Applications of Computer Vision (WACV)},
    year={2027}
  }

---

Rascene pushes mmWave sensing toward photorealistic 3D reconstructions. Below is the demo video showing how to collect Radar data and its corresponding LiDAR point clouds.

## Demo Video:
<div class="embed-responsive embed-responsive-16by9 mb-3">
<video class="embed-responsive-item" controls preload="metadata" poster="/assets/images/covers/2026_cvpr_cover.png">
  <source src="/assets/videos/2025-cvpr.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
</div>