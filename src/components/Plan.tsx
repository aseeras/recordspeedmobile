import Checkmark from "@/utils/svg/Checkmark";
import Eye from "@/utils/svg/Eye";
import People from "@/utils/svg/People";
import cx from "classnames";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export function Tabs({
  selectedIndex,
  children,
  onChange,
}: {
  selectedIndex: number;
  children: React.ReactNode;
  onChange: (index: number) => void;
}) {
  return (
    <View className="w-full items-center">
      <View
        style={{
          shadowColor: "#9CA3AF",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.12,
          shadowRadius: 4,
          elevation: 2,
        }}
        className="flex-row bg-white rounded-md p-[6px] w-11/12"
      >
        {React.Children.map(children, (child, i) => {
          return (
            <TouchableOpacity
              onPress={() => onChange(i)}
              style={{ gap: 8 }}
              className={cx(
                "flex-1 flex items-center justify-center rounded-[4px] py-[7px] px-[39px]",
                selectedIndex === i ? "bg-gray-2" : "bg-white"
              )}
            >
              {child}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function Tab({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-primary-black text-base font-medium leading-[22px]">
      {children}
    </Text>
  );
}

export function PlanContainer({
  children,
  containerStyle = "green",
}: {
  children: React.ReactNode;
  containerStyle?: "green" | "blue";
}) {
  return (
    <View
      style={{ gap: 16 }}
      className={cx("items-center border rounded-lg p-4", {
        "border-primary-green": containerStyle === "green",
        "border-brand-blue border-4 bg-pastel-blue-008":
          containerStyle === "blue",
      })}
    >
      {children}
    </View>
  );
}

export function PlanTitle({
  titleStyle = "regular",
  alignment = "center",
  children,
}: {
  titleStyle?: "regular" | "bold";
  alignment?: "center" | "left";
  children: React.ReactNode;
}) {
  return (
    <Text
      className={cx("w-full", {
        "text-primary-black text-3xl leading-[38px] font-bold":
          titleStyle === "regular",
        "text-brand-blue text-[48px] leading-[58px] font-bold":
          titleStyle === "bold",
        "text-center": alignment === "center",
        "text-left": alignment === "left",
      })}
    >
      {children}
    </Text>
  );
}

export function PlanFeature({
  children,
  icon = null,
  bottom = null,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  bottom?: React.ReactNode;
}) {
  return (
    <>
      <View style={{ gap: 16 }} className="flex-row">
        <View className="pt-1">{icon}</View>
        <View className="flex-1">{children}</View>
      </View>
      {bottom}
    </>
  );
}

export function PlanFeatureTitle({
  children,
  titleStyle = "regular",
}: {
  children: React.ReactNode;
  titleStyle?: "regular" | "blue";
}) {
  return (
    <Text
      className={cx("text-base font-bold", {
        "text-dark-4": titleStyle === "regular",
        "text-brand-blue": titleStyle === "blue",
      })}
    >
      {children}
    </Text>
  );
}

export function PlanFeatureDescription({
  children,
  descriptionStyle = "regular",
}: {
  children: React.ReactNode;
  descriptionStyle?: "regular" | "blue";
}) {
  return (
    <Text
      className={cx("text-base", {
        "text-dark-4": descriptionStyle === "regular",
        "text-brand-blue": descriptionStyle === "blue",
      })}
    >
      {children}
    </Text>
  );
}

export function PlanDivider({
  text,
  dividerStyle = "regular",
}: {
  text?: string;
  dividerStyle?: "blue" | "regular";
}) {
  if (!text) {
    return (
      <View
        className={cx("h-[1px] w-full border-t", {
          "border-gray-2": dividerStyle === "regular",
          "border-pastel-blue-016": dividerStyle === "blue",
        })}
      />
    );
  }

  return (
    <View className="flex-row items-center">
      <View
        className={cx("h-[1px] flex-1 border-t", {
          "border-gray-2": dividerStyle === undefined,
          "border-pastel-blue-016": dividerStyle === "blue",
        })}
      />
      <Text
        className={cx("text-center text-base font-bold", {
          "bg-white": dividerStyle === undefined,
          "text-brand-blue": dividerStyle === "blue",
        })}
      >
        {"  "}
        {text}
        {"  "}
      </Text>
      <View
        className={cx("h-[1px] flex-1 border-t", {
          "border-gray-2": dividerStyle === undefined,
          "border-pastel-blue-016": dividerStyle === "blue",
        })}
      />
    </View>
  );
}

export function PlanPrice({
  priceStyle = "regular",
  price,
  interval,
}: {
  priceStyle: "blue" | "regular";
  price: number;
  currencyCode?: string;
  interval: "month" | "year";
}) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return (
    <View className="flex-row items-end justify-center text-center py-2">
      <Text
        className={cx("text-[40px] leading-[48px] font-bold", {
          "text-primary-black": priceStyle === "regular",
          "text-brand-blue": priceStyle === "blue",
        })}
      >
        {formatter.format(price / 100)}
      </Text>
      <Text
        className={cx("leading-[22px] text-sm pb-2", {
          "text-primary-black": priceStyle === "regular",
          "text-brand-blue": priceStyle === "blue",
        })}
      >
        /{interval}
      </Text>
    </View>
  );
}

export function PlanFeatureIcon({
  icon,
  color,
}: {
  icon: string;
  color?: string;
}) {
  switch (icon) {
    case "check":
      return <Checkmark color={color} />;
    case "eye":
      return <Eye color={color} />;
    case "people":
      return <People color={color} />;
    default:
      return <></>;
  }
}
