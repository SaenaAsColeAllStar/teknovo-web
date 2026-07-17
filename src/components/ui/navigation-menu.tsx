"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactElement,
} from "react";

import { cn } from "@/lib/utils";

type NavigationMenuProps = ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & {
  viewportVariant?: "default" | "public-mega";
};

const NavigationMenu = forwardRef<ComponentRef<typeof NavigationMenuPrimitive.Root>, NavigationMenuProps>(
  ({ className, children, viewportVariant = "default", ...props }, ref): ReactElement => (
    <NavigationMenuPrimitive.Root
      ref={ref}
      className={cn(
        "relative z-10 flex max-w-max flex-1 items-center justify-center",
        viewportVariant === "public-mega" && "static",
        className,
      )}
      {...props}
    >
      {children}
      <NavigationMenuViewport variant={viewportVariant} />
    </NavigationMenuPrimitive.Root>
  ),
);
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.List>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref): ReactElement => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn("group flex list-none items-center justify-center gap-0.5 lg:gap-1", className)}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-none px-2.5 text-sm font-medium text-heading transition-colors hover:bg-border-default/55 hover:text-brand-strong focus:bg-border-default/55 focus:text-brand-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-brand data-[state=open]:text-white data-[state=open]:shadow-none hover:data-[state=open]:bg-brand-strong hover:data-[state=open]:text-white focus:data-[state=open]:bg-brand-strong focus:data-[state=open]:text-white",
);

const NavigationMenuTrigger = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref): ReactElement => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), className)}
    {...props}
  >
    {children}
    <ChevronDown
      className="relative top-px ml-1 size-3.5 shrink-0 opacity-70 transition duration-300 group-data-[state=open]:rotate-180"
      aria-hidden
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref): ReactElement => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full md:absolute md:w-auto",
      "data-[motion^=from-]:animate-teknovo-slide-in-down",
      className,
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport> & {
    variant?: "default" | "public-mega";
  }
>(({ className, variant = "default", ...props }, ref): ReactElement => (
  <div
    className={cn(
      "absolute left-0 top-full flex justify-center",
      // Anchor to sticky header bottom (nearest positioned ancestor), not a guessed rem offset.
      variant === "public-mega" &&
        "pointer-events-none inset-x-0 z-[60] justify-center px-4",
    )}
  >
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-none border border-border-default bg-surface text-heading shadow-[0_16px_40px_-24px_rgb(19_19_186/0.28)] transition-[width,height] duration-300 ease-out md:w-[var(--radix-navigation-menu-viewport-width)]",
        variant === "public-mega" &&
          "pointer-events-auto mt-0 w-[min(100vw-2rem,72rem)] max-w-[min(100vw-2rem,72rem)] origin-top rounded-none border border-border-default bg-surface text-heading shadow-[0_16px_40px_-24px_rgb(19_19_186/0.35)] md:w-[min(100vw-2rem,72rem)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Indicator>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref): ReactElement => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden transition-opacity data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100",
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-brand shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
