---
title: "Latis - Consensus Based IoT Security"
date: "Apr 29, 2023"
description: "A proof of concept on DLT-backed over the air update transactions for securing the modern Industry 4.0 IoT update workflow."
tags: [Tech]
slug: latis
subtitle: "A proof of concept on DLT-backed over the air update transactions for securing the modern Industry 4.0 IoT update workflow."
---

Manufacturers, supply chain managers, and infrastructure centers generally want several things:

- Ease of monitoring
- Things to not stop running
- Higher throughput

Recently, the operational technology (OT) landscape has widely adopted the term "Industry 4.0," a movement promoting high connectivity of devices and systems through the internet. Many benefits are apparent through this: lights-out factories could be monitored and operated anywhere, better data analytics and machine learning applications can be used, and extremely fast autonomy between sensors and actuators is possible.

However, there are major issues with both Industry 4.0 adoption and legacy systems not on Industry 4.0: the security of manufacturing systems is increasingly vulnerable and will be suffering exponentially more attacks in the coming years.

## Some background

OT systems use some sort of Industrial Control System (ICS) to manage data, I/O control, telemetry, and functionality in a facility. In the ICS pyramid, I/O devices, such as heat sensors, actuators, and robotic end effectors, actually receive, send, and interpret data on edge to perform and monitor tasks. The next level up are Programmable Logic Controllers and Remote Terminal Units. These are interfaces for the actual devices that can take in data and control others through output channels or provide telemetry to a data acquisition system or other devices. Often, they are in the form of ASIC boards, microcontrollers, microcomputers, or general-purpose computers, and often the programming/updating process of these devices requires USB, Serial, or network connections. The next relevant level is Supervisory Control and Data Acquisition systems (SCADA). This is a framework that helps with the control and data acquisition of systems, machines, and devices in or across facilities. SCADA describes the combined use of edge devices and software systems working on a common task.

In the current state of the general OT landscape, many processes governed by ICS systems are integral to high throughput and constant functionality. Due to the computing power of these systems, many facilities implement an "air gap" defense system → removing internet access to the devices or intranet completely. However, it is very hard to make a completely air-gapped system that also employs IoT/connected devices; as long as one device has internet access, no matter what VPN, CA, or firewall is in place, there is always a vulnerability of a bad actor entering a protected network. Increasingly, bad actors are accessing secure networks through internal activity, such as through phishing emails and employee bad actors. Cloud-based solutions are also hard to secure fully; many OT companies use devices from hundreds of third-party OEMs, and interoperability integration is an ongoing problem that only larger companies could dedicate time to address. Once access to any end effector, PLC/RTU, or SCADA system is compromised, a bad actor can possibly bring down entire facilities and societal infrastructure by exploiting zero days. Stuxnet, CRASHOVERRIDE, and Night Dragon are only a few examples of successful attacks against ICS systems that have cost facilities millions every encounter and have brought down regional power grids in places like Ukraine.

IBM's X-Force Threat Intelligence Index for 2022 marked manufacturing as the most attacked industry in the world, with 47% of the entryways through vulnerabilities and exploits. There also was a 3000% surge in IoT malware activity between 2019 and 2020 as attackers started to blend their traffic with cloud and network activity. IBM reported that there was a 2204% increase in adversarial surveillance on popular SCADA protocols between January and September of 2021, as the vulnerabilities related to IoT devices have increased by 16% year over year; for ICS systems specifically, the growth was 50%.

If there is such a big risk of cyber attacks on OT systems, and that many of these threats happen due to legacy systems (many of which have not had the firmware updated since acquisition), why do people not spend more time updating and improving the firmware and hardware-software security of these devices? There are several issues with this.

- Many older devices currently rely on third-party employees or OEM employees to physically come and update a device. This requires the device to be taken off the assembly line, reducing throughput.
- After updating these devices, especially in government contractor environments, security analysis has to be performed extensively (NIST-800, CMMC 2.0, etc.) to make sure that there is no tampering with the update and that the update follows standards
- Smaller devices have a form factor that doesn't allow the hardware for very secure encryption/decryption algorithms, nor the chips that allow for a TEE in place.
- OTA updates are faster, but they mostly rely on a cloud or mirror list server; these are susceptible to middleman attacks and have a large attack surface due to the lack of overall security and the centralized nature of these servers. Additionally, they require either internet access on the devices, or external hardware to help with the communication.

## A Proposed Solution

In the past few months, I have been researching and developing a proof of concept of an OTA update pipeline for large-scale actuator IoT devices that:

- Allows for trusted updates (you know for sure the update the IoT device receives is the one issued by the OEM and is facilitated by the governing manufacturer)
- Removes attack surfaces between the OEM and the IoT devices
- Provides scalability with other IoT devices and intranets
- Provides interoperability

To do this, I propose LATIS, powered by DLTs and hardware encryption for end-to-end trust and authenticated OTA transactions.

Decentralized Ledger Technology (DLT) provides inherent trust and authenticity to the entire system due to a consensus mechanism. DLTs include technologies but are not limited to, blockchains (Ethereum, Solana, Cosmos, etc.) and hash graphs/DAGs (Hedera). We can think of OTA updates as sort of a supply chain issue; how do we get an update securely from any third-party OEM to the end receiver, the IoT device? Looking at systems operating with SIMBA Chain (at Boeing) and Hyperledger Fabric (at Walmart and Amazon) for supply chain, the transparency, immutability, and full authenticity of ledger additions and transaction records provide a trusted dataset of all points a payload gets passed between stations. Similarly, by allowing the IoT device, the OEM, and the manufacturer to be agreed authenticators of a contract to perform an OTA update, the system allows for an update to be transferred directly from the OEM provider to the manufacturer without any interference from other actors. Specifically, it ensures that the integrity of the file sent from the OEM is upheld all the way to the machine itself, while still providing the manufacturer control over the process. No middleman is able to really interfere with the updating process. DLTs also are great for this purpose because of the many third-party actors a manufacturer has to interact with. Boeing works with both Rockwell and Honeywell; they would not really want Rockwell to be able to somehow access Honeywell's devices and vice versa, while also wanting them to have direct access to provide an OTA update. By writing a proper smart contract, secure interoperability is possible.

To ensure that the file itself is stored securely and cannot be tampered with unless authenticated by the DLT network, a version of a system like Interplanetary File Storage (IPFS) can be used. This is a decentralized peer-to-peer file storage system, often to which files are uploaded as hot storage before pushing to decentralized storage networks like Filecoin and Arweave for perpetual cold storage across many peers. Access to these files could be allowed only with proper authentication with a smart contract (zk application :D), such as if the IoT device requests access to these files. No one can mutate these files, ensuring trust after uploading an update.

Another benefit of DLTs is that, although all the technologies mentioned here run on a global decentralized network, it is possible to have proxied/secret networks as well as locally hosted networks. Validation nodes could technically be put on every device for consensus, and a permissioned decentralized network could be hosted within an intranet with similar functionality. In fact, some chains, like IOTA, are moving in this direction of providing lightweight consensus implementations on smart contracts for industrial applications. Additionally, decentralized networks like these could extend to telemetry, reducing the attack surface and capabilities of botnets and DDoS attacks by several magnitudes.

With smart contracts and DLTs, along with traditional encryption and CA systems, the entire OTA system could be secured and authenticated with a trusted layer. However, to ensure that the active actors (OEM, manufacturer, and IoT device) are authorized to commit transactions, hardware-based keys surpass any other solution we looked at: 1) physical security is the best security 2) ease of application and use in form factor.

Using "hardware wallets" like Ledgers, human operators, who are authorized, can perform transactions on the smart contracts to upload and facilitate updates. Meanwhile, the IoT device could use features in its trusted executable environment (TEE), such as an eFuse. This is a hash that is burned into fuses, randomly generated each time an MCU chip is manufactured, that is a hardware-based private key and is used in situations like secure boot sequences; only the TEE can use this private key, and it is extremely secure physically. TEEs run parallel with the main OS, but provide a secure environment for programs to run. ARM Trustzone Technology and Apple's Secure Enclave are examples of TEEs with such capabilities. With several examples of crypto wallets using the Secure Enclave, and there are possibilities of setting private keys for web3 wallets on some chains, it is possible to use the TEE to store and run an eFuse-authenticated wallet for smart contract execution on the overall LATIS pipeline. By keeping the update and bootloading systems on the edge and autonomous, and ensuring that hardware authentication is used, we reduce the attack surface even more for OTA updates.

## Proof of Concept

My team built a proof of concept of the entire OTA system, powered by Hedera and Filecoin Estuary as the DLT backends; in the time that we had, we created a working prototype of the majority of the system developed, and presented this to several top execs at Boeing and CAT, including Boeing CEO David Calhoun.

We chose Hedera for this since it is a hash graph and requires less compute, theoretically allowing for the actual implementation of a locally hosted network. In retrospect, some networks like Cosmos and Hyperledger may have been more effective. The web applications are locally hosted and were built using Sveltekit + Tailwind.

Prototype Systems Diagram:

![](/hardtech/latissystemdiagram.png)

There are three main smart contracts that run the backend authentication for updates; the OEM, the Middleman, and the Manufacturer contracts. The OEM and Manufacturer are accessed by their respective actors, while the middleman contract is only accessible by authorized smart contracts. We used Ledger Nano S Plus as hardware keys for the OEM and the Manufacturer to authorize access to the portals, as shown below. Once they log in using the Ledger and pass the OAuth screen, they are met with their respective portals (green is OEM, fuschia is Manufacturer).

![](/hardtech/latisoemledger.jpg)

The OEM portal includes a component to upload an update file to Filecoin. When all of the metadata and the file are filled in, the backend first performs a simple block cipher on the file and then stages it on IPFS to upload to Filecoin, using the Estuary node client. It returns its CID, the miners, and the URL to access the file. Additionally, the metadata is pushed to the OEM smart contract, which then updates the middleman contract with relevant information. When the OEM "pushes" an update to specific manufacturers, the middleman contract would send a notification, similar to an interrupt, to the Manufacturer, signaling that there is a new update.

![](/hardtech/latisoemscreen.jpg)

![](/hardtech/latismanuscreen.jpg)

On the manufacturer portal, they can then select all the basic information to facilitate the update, including the OEM, the type of device, the version of the update, and the device ID (MAC address or UUID). Assigning the update would notify the IoT device that there is an update waiting for it, and it would then pull the information from the middleman contract to pull the data off of Filecoin. Then, it would automatically decrypt and apply the update. In our scenario for the demo, we had a rpi 3b act as an RTU, pull an update, decrypt it, and PXEBoot another rpi 3b. Nowhere in this entire pipeline does the manufacturer or any other actor have access to the pushed update, aside from the IoT device. Additionally, everything that we could put on a DLT was put on a DLT and encrypted/secured (either ciphers or OpenZepplin), maximizing the overall security of the system.

![](/hardtech/latispres.jpg)

Here is a photo of my prototyping team (and me) showcasing our demo. Almost everything worked in integration; some loops had to be jumped through for more seamless notifications between portals, but everything was tested to work individually beforehand, which proves the concept's validity. Additionally, we were unfortunately not able to utilize the rpi's TEE; the ARM Trustzone on the computers is notoriously unstable, insecure, and hard to work with (had to use OpTEE) so we decided to scrap it for time's sake. Additionally, we believe this solution has a lot of potential, but the actual infrastructure to implement this is not ready yet; noninvasiveness would be a system design challenge. However, overall we were able to showcase the possibilities of using DLTs as a viable backend for secure, trusted, and authorized OTA updates for IoT. Future work would involve actual integration with a large-scale actuator, like a CNC machine, as well as integrating better cryptographic practices, both on-chain and off.
