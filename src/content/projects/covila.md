---
title: CoViLa
subtitle: Computer Vision Ball Launcher
slug: covila
links: []
description: Computer Vision Ball Launcher
---

![](/hardtech/covilaskate.jpg)

Imagine a world where you can play fetch with your dog without having to throw the ball. Or where you can train for a sport without needing a throwing partner. That is where CoViLa's inspiration came to be.

As part of my TJ senior research project, I worked on the development of the autonomous human identifier and tracker, as well as the motor control for the ball launcher.

## CV

Fast, real-time CV was a challenge for this project, as we were running fairly low compute powere on a Raspberry Pi 4. Therefore, I used OpenCV haar-cascades for realtime torso detection. I also used OpenCV for identifying a person through centroids. This allowed the system to track a person, be robust to possible noise and occlusion, and be able to identify a person even if they were not facing the camera.

To be able to estimate the distance of the person from the camera, I used a stereo camera setup and the library StereoVision. This allowed me to estimate the distance of the person from the camera, and therefore the angle at which the ball should be launched.

## Robot

The robot was modeled in Autodesk Fusion and built using 80x20 aluminum extrusion with a spinning jenny for free rotation. The robot was controlled using a Raspberry Pi 4 and a L298N motor driver. With a high RPM motor, we created a 3D printed flywheel that could launch a ball at a speed of 20mph. We got the robot to effectively move, track a person, and launch a ball. However, one oversight we had was that the flywheel would get very hot. Eventually, the wheel melted and the motor burned out.

<iframe src="https://drive.google.com/file/d/1JJK_mDchtpIRAuP8Y-i79m4zjK38XgG3/preview" class="w-full aspect-video md:h-96 h-64 my-2" frameborder="0" allowfullscreen allow="autoplay" title="CoViLa"></iframe>
