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
  - Kunzhe Song
  - Ruxin Lin
  - Huacheng Zeng
affiliations: INSS Lab, Michigan State University
links:
  Paper: /publications/2026/2027-pub-wacv.html
  Code: https://github.com/Geo-Chou/RadPose
  Checkpoints: https://huggingface.co/Geochou/RadPose
  Dataset: /projects/2027-radpose/#dataset
  # Replace with your file URL; rename to Poster if needed, or add both.
  # Slides: https://blank
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

## Dataset

RadPose dataset consists of 183,497 radio frames with the ground-truth pose annotations of 11 subjects in 21 scenes. The ground-truth annotations are derived from corresponding depth camera frames with pretrained RTMPose model [27].  RadPose dataset covers the subjects without motion sequences, fixed motion amplitudes, or designated activity locations. Of the 21 scenes, 75% data of 17 scenes (/seen/train/) are used for model training. The remaining 25% data (/seen/val/) and holdout 4 scenes (/unseen/test) are reserved for evaluation.

[Download Here (1.8TB in total)](https://mirrors.egr.msu.edu/inss/RadPose_dataset/download_radpose.sh)

Samples in RadPose dataset:
![RadPose dataset samples](/assets/images/projects/2026radpose/overview.jpg)


## Qualitative results

The following examples show RadPose predictions across seen and unseen environments.

### Seen environment

![RadPose qualitative results in a seen environment](/assets/images/projects/2026radpose/seen_1.png)

### Unseen environments

![RadPose qualitative results in an unseen environment](/assets/images/projects/2026radpose/unseen_1.png)

![Additional RadPose result in an unseen environment](/assets/images/projects/2026radpose/unseen_01.png)

![Additional RadPose result in a second unseen environment](/assets/images/projects/2026radpose/unseen_02.png)

![Additional RadPose result in a third unseen environment](/assets/images/projects/2026radpose/unseen_03.png)
