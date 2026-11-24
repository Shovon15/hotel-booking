"use client";

import { useState } from "react";
import { Eye, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import ImageComponent from "../image";
import NavLink from "../link/NavLink";
import Rating from "../rating/Rating";
import { cn } from "@/utils/helpers/cn";
import { formatPrice, getDiscountPercent } from "@/utils/helpers/formatPrice";
import { ShopProduct } from "@/types/shop";

type Props = {
  product: ShopProduct;
  className?: string;
};

const BADGE_STYLES: Record<NonNullable<ShopProduct["badge"]>, string> = {
  hot: "bg-primary text-white",
  new: "bg-brand text-white",
  sale: "bg-accent text-foreground",
};

export default function ProductCard({ product, className }: Props) {
  // local UI state for now — wire to the cart / wishlist store later
  const [quantity, setQuantity] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount = getDiscountPercent(product.price, product.oldPrice);
  const href = `/product/${product.slug}`;

  return (
    <div
      className={cn(
        "group relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden",
        "transition-all duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-[0_12px_30px_-12px_rgba(15,95,61,0.25)]",
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-square bg-surface overflow-hidden">
        <NavLink href={href} hover={false} className="block w-full h-full">
          <ImageComponent
            src={product.image}
            alt={product.title}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </NavLink>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none">
          {discount > 0 && (
            <span className="bg-primary text-white text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.badge && product.badge !== "sale" && (
            <span
              className={cn(
                "text-[10px] md:text-[11px] font-bold uppercase px-2 py-0.5 rounded-full",
                BADGE_STYLES[product.badge],
              )}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={() => setIsWishlisted((v) => !v)}
          className={cn(
            "absolute top-2.5 right-2.5 size-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur shadow-sm transition",
            isWishlisted ? "text-primary" : "text-gray-500 hover:text-primary",
          )}
        >
          <Heart size={16} className={cn(isWishlisted && "fill-primary")} />
        </button>

        {/* Quick view — desktop hover only */}
        <div className="hidden lg:flex absolute inset-x-3 bottom-3 translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300">
          <NavLink
            href={href}
            hover={false}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/95 backdrop-blur text-xs font-semibold text-foreground shadow-md hover:bg-brand hover:text-white transition-colors"
          >
            <Eye size={15} /> Quick View
          </NavLink>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-1.5 p-3 md:p-4">
        <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-brand/80">
          {product.category.replace("-", " ")}
        </span>

        <NavLink
          href={href}
          hover={false}
          className="text-[13px] md:text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5em] text-foreground hover:text-brand transition-colors"
        >
          {product.title}
        </NavLink>

        <div className="flex items-center justify-between gap-2">
          {product.rating !== undefined && (
            <Rating value={product.rating} reviews={product.reviews} size={12} />
          )}
          {product.unit && (
            <span className="hidden sm:inline text-[11px] text-muted whitespace-nowrap">
              {product.unit}
            </span>
          )}
        </div>

        <div className="mt-auto pt-1 flex items-end gap-2 flex-wrap">
          <span className="text-base md:text-lg font-bold text-brand leading-none">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through leading-none pb-0.5">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Cart action */}
        <div className="pt-2">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => setQuantity(1)}
              className="w-full h-9 md:h-10 flex items-center justify-center gap-2 rounded-xl bg-brand-light text-brand text-xs md:text-sm font-semibold transition-colors hover:bg-brand hover:text-white active:scale-[0.98]"
            >
              <ShoppingBag size={16} />
              Add to cart
            </button>
          ) : (
            <div className="w-full h-9 md:h-10 flex items-center justify-between rounded-xl bg-brand text-white overflow-hidden">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(0, q - 1))}
                className="h-full px-3 hover:bg-brand-dark transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="text-xs md:text-sm font-semibold tabular-nums">
                {quantity} in cart
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
                className="h-full px-3 hover:bg-brand-dark transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
