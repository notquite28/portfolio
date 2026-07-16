---
title: "Gaming on NixOS! ❄️"
description: "A walkthrough for setting up gaming on NixOS with Wayland, Hyprland, OpenGL drivers, Nvidia considerations, Steam, and practical troubleshooting."
author: "Arnav Panigrahi"
published: "2024-11-17"
updated: "2024-11-17T10:47:07.117Z"
categories: ["configuration-nixos", "linux", "nvidia", "nixos", "gaming"]
---


![A NixOS gaming setup desktop](/posts/images/f98506351a24/01.jpg)
*A very serious NixOS gaming setup, naturally.*

## Introduction

In my last post, I lauded NixOS as I installed Zen Browser from an external flake. And I can already hear you saying, “Enough with the NixOS hype, just let me play some games!” I get you! After all, who wouldn’t want to revisit *NieR: Replicant*, *Persona 5*, or *Yakuza* after a long day and still get to say they did it on NixOS?

In this post, I’ll (hopefully) guide you through setting up gaming on NixOS with Wayland and Hyprland, documenting the journey along the way. Let’s start by enabling OpenGL drivers in our configuration.nix file.

```
# configuration.nix
{ config, pkgs, inputs, … }:
{
   hardware.opengl = {
      enable = true;
      driSupport = true;
      driSupport32bit = true;
    };
}
```

Next, depending on your setup, you’ll need to enable the appropriate GPU drivers. We all know the infamous NVIDIA woes on Linux—especially with Wayland! But don’t worry, it’s been [improving](https://developer.nvidia.com/blog/nvidia-transitions-fully-towards-open-source-gpu-kernel-modules/). I’ve played through the entirety of *God of War Ragnarok* and *NieR: Automata* on my Hyprland/Arch setup, so I’m hopeful that NixOS will be just as smooth.

For Nvidia, you’ll need this line in your configuration:

```
services.xserver.videoDrivers = ["nvidia"];
# services.xserver.videoDrivers = ["amdgpu"];
```

For NVIDIA users, you might also need to enable modesetting:

```
hardware.nvidia.modesetting.enable = true;
```

## Gaming Laptops

But wait—if you’re like me and you bought an NVIDIA hybrid gaming laptop to run Linux on, you’ll need to enable Prime. This allows you to offload graphic tasks to your dedicated GPU (dGPU) or suspend it for power-saving, depending on the workload.

You have two options: sync and offload. Sync keeps the dGPU running constantly, which is usually overkill. On the other hand, offload wakes up the dGPU when needed and lets the integrated GPU (iGPU) handle lower workloads, which helps my laptop’s battery life last longer.

On Arch, I have used **rog-control-center** (basically, a Linux-friendly Armory Crate alternative) and can vouch for its ability to adjust temperature limits and fan curves reliably. You can also use **supergfxctl**, a tool by the same devs, to switch between integrated, hybrid, and VFIO (for GPU passthrough to VMs) modes.

Run this command to get your bus IDs for the GPUs.

```
❯ nix shell nixpkgs#pciutils -c lspci | grep VGA
00:02.0 VGA compatible controller: Intel Corporation Raptor Lake-P [UHD Graphics] (rev 04)
01:00.0 VGA compatible controller: NVIDIA Corporation AD107M [GeForce RTX 4060 Max-Q / Mobile] (rev a1)
```

Add the bus IDs into your configuration.nix:

```
{ pkgs, ...}
{
  hardware.nvidia.prime = {
    offload = {
      enable = true;
      enableOffloadCmd = true; # Lets you use `nvidia-offload %command%` in steam
    };

    intelBusId = "PCI:00:02:0";
    # amdgpuBusId = "PCI:0:0:0";
    nvidiaBusId = "PCI:01:00:0";
  };
}
```

If you are on a gaming laptop and want the vendor-specific defaults to behave correctly, the official [NixOS hardware repo](https://github.com/NixOS/nixos-hardware/) has ready-to-use configurations for you. Just find your laptop model and copy the appropriate settings. (Pro tip: use flakes for this)

```
{
  description = "A very basic flake";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    nixos-hardware.url = "github:NixOS/nixos-hardware/master";
  };

  outputs = { nixpkgs, nixos-hardware, ... } @ inputs:
  {
   nixosConfigurations.nixchan = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      specialArgs = { inherit inputs; };

      modules = [
      ./configuration.nix
       nixos-hardware.nixosModules.asus-zephyrus-gu603h # this is my laptop
      ];
    };
  };
}
```

## Installing software

To make your life easier, enable Steam and add a few essential packages to your system. I recommend **mangohud** (for performance monitoring) and **protonup-qt** (to install custom Proton versions, which can improve game compatibility).

```
programs.steam.enable = true;
programs.steam.gamescopeSession.enable = true;
programs.gamemode.enable = true;

environment.systemPackages = with pkgs; [mangohud protonup-qt lutris bottles heroic];
```

Once that’s done, you can switch between custom Proton versions in the **Steam compatibility tab** for each game. If you’re playing non-Steam games, I highly recommend using **Heroic**—it simply works.

If you’re ever stuck, check the community’s recommendation for Steam launch arguments on [protondb](https://www.protondb.com/)!

## Conclusion

And that’s it! With just a bit of configuration, your NixOS system should be ready to game. Now you can bring up that you use NixOS in every conversation you have. Also, big thanks to Vimjoyer for making NixOS easier to understand. A major chunk of this post is based on his [video](https://www.youtube.com/watch?v=qlfm3MEbqYA).

Cheers!
