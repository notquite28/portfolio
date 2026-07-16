---
title: "Installing Zen Browser on NixOS ❄️"
description: "A beginner-friendly NixOS flake and Home Manager walkthrough for installing Zen Browser from an external flake on a declarative Linux setup."
author: "Arnav Panigrahi"
published: "2024-11-16"
updated: "2024-11-16T04:07:04.601Z"
categories: ["nix", "linux", "home-manager-in-nixos", "nixos", "home-manager-nixos"]
---


## Introduction

We all know Linux users. We either spend years living comfortably on Debian or jump into more adventurous distros like Arch and Gentoo. I am the latter. Spending days trying to figure out what broke my Arch distro while dealing with work deadlines and grad school projects, I am convinced that I have a very specific tolerance for self-inflicted Linux problems. But lately, I felt Arch has been a bit too stable for me. My last install broke due to a user error where I installed an incompatible kernel and my initramfs was confused. This won’t do! So of course, I did what most normal people would do. I bought a used ThinkPad T480s from eBay for a measly 90$ to dip my toes into the “new Arch” distro, NixOS!

## NixOS, flakes and home-manager

![The unofficial NixOS mascot](/posts/images/7ae541f5533f/01.png)
*The unofficial NixOS mascot, because every operating system deserves one.*

NixOS is truly mind-boggling. When I learned that this came from **Eelco Dolstra**’s PhD thesis on “correct software deployment,” I was both intrigued and humbled. NixOS is lauded for its modularity, reproducibility, and declarative approach to system configuration.

If you want a quick NixOS setup and you don't want to watch dozens of hours of [*Vimjoyer*](https://youtu.be/a67Sv4Mbxmc?si=TP0RYzfmuVjhn7oD)’s NixOS videos, be sure to check out [Fernando Borretti](https://borretti.me/article/nixos-for-the-impatient#postinstall)’s quick install guide.

If you have looked up info on Nix, you probably know you could imperatively install anything on Nix just like on Arch:

```
nix-shell -p <package name>
```

which is basically the NixOS counterpart of Arch’s incredibly convenient

```
sudo pacman -S <package name>
```

But we are on NixOS! We want to do stuff the Nix way! We want to declaratively install packages! Even if they don’t exist in the official NixOS package repo!

Let’s proceed to what is really important. Nix is a very versatile language; no two configs will be identical. It is important to understand the basics of the language to efficiently write your configs. This can take weeks or even months to fully click. I was impatient, so I did the next best thing: study my friend’s config and adapt it for my setup. Thanks, draff.

My flake.nix and home.nix probably look different than yours because I followed [Drake Rossman](https://drakerossman.com/blog/how-to-add-home-manager-to-nixos)’s excellent guide on setting up home-manager as a module. I want home-manager to rebuild alongside NixOS because it is more convenient. Also, I moved everything inside /etc/nixos to /home/quiet/Documents/nixos and symlinked it to the original folder so I can edit the files as a regular user without root.

The two important lines I’d recommend adding to configuration.nix are:

```
nix.settings.experimental-features = ["nix-command" "flakes"];
environment.systemPackages = with pkgs; import ./packages.nix { inherit pkgs; };
```

Now I can keep the configuration.nix file clean and declare my system packages in packages.nix like such:

```
{ pkgs, … }:
with pkgs; [
vim
git
kitty
# and so on
]
```

This is my flake.nix

```
{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "GitHub:nixos/nixpkgs?ref=nixos-unstable";
    hyprland.url = "GitHub:hyprwm/Hyprland";
    catppuccin.url = "GitHub:catppuccin/nix";
    zen-browser.url = "GitHub:0xc000022070/zen-browser-flake";
      home-manager = {
      url = "GitHub:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { nixpkgs, catppuccin, home-manager, zen-browser, ... } @ inputs:
  {
   nixosConfigurations.nixchan = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      specialArgs = { inherit inputs; };

      modules = [
      ./configuration.nix
      ./hyprland.nix
      ./fonts.nix
      catppuccin.nixosModules.catppuccin
      home-manager.nixosModules.home-manager
            {
              home-manager.useGlobalPkgs = true;
              home-manager.backupFileExtension = "HMBackup";
              home-manager.useUserPackages = true;
              home-manager.users.quiet.imports = [
                ./home.nix
                catppuccin.homeManagerModules.catppuccin
              ];
              home-manager.extraSpecialArgs = { inherit inputs; system = "x86_64-linux";};
            }
          ];
    };
  };
}
```

The key line here is to add the following line to your flake inputs:

```
zen-browser.url = "GitHub:0xc000022070/zen-browser-flake";
```

Let’s look at my home.nix:

```
{ config, pkgs, system, inputs, ... }:

{
  home.username = "quiet";
  home.homeDirectory = "/home/quiet";

  # Packages that should be installed to the user profile.
  home.packages = with pkgs; [
    zip
    xz
    unzip
    p7zip
    oh-my-zsh
   oh-my-posh
    inputs.zen-browser.packages."${system}".specific
  ];

  # basic configuration of git, please change to your own
  programs.git = {
    enable = true;
    userName = "notquite28";
    userEmail = "example@example.com";
    extraConfig = {
        init.defaultBranch = "main";
    };
  };
# Catppuccin theme
  catppuccin = {
    enable = true;
    flavor = "mocha";
    accent = "blue";
  };

  # This value determines the home Manager release that your
  # configuration is compatible with. This helps avoid breakage
  # when a new home Manager release introduces backwards
  # incompatible changes.
  #
  # You can update home Manager without changing this value. See
  # the home Manager release notes for a list of state version
  # changes in each release.
  home.stateVersion = "23.11";

  # Let home Manager install and manage itself.
  programs.home-manager.enable = true;
}
```

If you don’t want to pass in your system from flake.nix, you could also declare it as a variable in home.nix as such:

```
{ config, pkgs, system, inputs, ... }:
let
  system = "x86_64-linux";
 in
{
  home.username = "quiet";
  home.homeDirectory = "/home/quiet";
## rest of home.nix
```

Now, all we have to do is rebuild the system.

```
sudo nixos-rebuild switch
```

Voila! Now you have a Firefox-based Arc-style browser installed on your NixOS system. I prefer Zen over Arc because it’s based on Firefox and not Chromium.

## Conclusion

For the impatient who cannot wait for Zen Browser to be added to the NixOS package set, this lets us install Zen from an external flake on GitHub.
This is a godsend for folks who don’t want to compile it from source. My ThinkPad took about three hours to compile it, and then it immediately got an update. So thanks to the [maintainer](https://github.com/0xc000022070/zen-browser-flake) who did it for us.

Keep in mind that running random flakes can be a security compromise. This is not a formal guide as much as the note I wish existed when I was trying to do this myself.

Also, I know GNU/Linux users love understanding *why* something works. I am impatient and was mostly concerned with the *how* this time. I just wanted to jump ship from Windows and never look back.

Cheers!
