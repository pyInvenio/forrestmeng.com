---
title: Lower-body Gravity Compensating Exoskeleton
subtitle: Assistive Robotics Lab
slug: exo
links: []
description: Assistive Robotics Lab
---

![](/hardtech/arlexo.jpg)

This exoskeleton is an active lower-body exoskeleton that is designed to help people with rehabilitation after a stroke. Grabbing information from sensors and motor encoders, the exoskeleton is able to calculate the position of the user's leg and ankle, and then use that information to compensate for gravity through varying the magnitudes of the force vectors applied to the user's harness.

## Predicting the Gait

Gait is the pattern of movement of the body during walking. In order for the exoskeleton to be comfortable for the user, it must be able to predict the gait of the user and provide varying amounts of force depending on which state of a step and swing the user is in. I programmed a state machine to predict the gait of the user and a varying linear regression model to predict the heuristic of the user's gait.

![](/hardtech/arlfsm1.png)

Using the code I wrote, I was able to predict the gait of the user every time and was able to provide natural and comfortable.

![](/hardtech/arlgraph.png)
