---
layout: project
title: "RadPose: ISAC-based RF 3D Human Pose Estimation"
date: 2026-10-25
venue: The IEEE/CVF Winter Conference on Applications of Computer Vision (WACV)
year: 2027
cover: /assets/images/covers/2027_radpose_cover.png
summary: High-fidelity 3D human pose estimation using mmWave OFDM communication signals; companion project page for the WACV 2027 paper.
authors:
  - Geo Jie Zhou
  - KunZhe Song
  - Ruxin Lin
  - Huacheng Zeng
affiliations: INSS Lab, Michigan State University
links:
  Paper: /publications/2026/2027-pub-wacv.html
  Code: https://github.com/Geo-Chou/RadPose
  Checkpoints: https://blank
  Dataset: https://mirrors.egr.msu.edu/inss/RadPose_dataset/
  # Replace with your file URL; rename to Poster if needed, or add both.
  Slides: https://blank
citation: |
  @inproceedings{zhou2027radpose,
    title={RadPose: ISAC-based RF 3D Human Pose Estimation},
    author={Zhou, Geo Jie and Song, Kunzhe and Lin, Ruxin and Zeng, Huacheng},
    booktitle={The IEEE/CVF Winter Conference on Applications of Computer Vision (WACV)},
    year={2027}
  }
---

## Demo Video

We demonstrate a video of ISAC data and the corresponding human pose estimation results, including typical movements in our dataset (walking, waving, squatting and standing).

[Demo Video](https://media.geo-zhou.com/Demo_RadPose_anonymous.mp4)

## Abstract

Human pose estimation under adverse lighting and occlusion conditions remains challenging for camera- and LiDAR-based systems. RadPose is a learning-based monostatic integrated sensing and communication (ISAC) framework that enables commodity mmWave communication devices to perform 3D human pose estimation. It extracts radio point clouds directly from standard OFDM communication signals and combines cross-frame pose inference with inverse-kinematics refinement for robust estimation in seen, unseen, and occluded environments.

## Qualitative results

The following examples show RadPose predictions across seen and unseen environments.

### Seen environment

![RadPose qualitative results in a seen environment](/assets/images/projects/2026radpose/seen_1.png)

### Unseen environments

![RadPose qualitative results in an unseen environment](/assets/images/projects/2026radpose/unseen_1.png)

![Additional RadPose result in an unseen environment](/assets/images/projects/2026radpose/unseen_01.png)

![Additional RadPose result in a second unseen environment](/assets/images/projects/2026radpose/unseen_02.png)

![Additional RadPose result in a third unseen environment](/assets/images/projects/2026radpose/unseen_03.png)
