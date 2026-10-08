import { View, Pressable, Text } from "react-native";
import SignOut from "../utils/svg/SignOut";
import { Fragment, ReactNode } from "react";
import ArrowDown from "@/utils/svg/ArrowDown";
import File from "@/utils/svg/File";
import UserLarge from "@/utils/svg/UserLarge";
import { router } from "expo-router";
import Button from "@/components/Button";
import { AccountType } from "@/lib/types";
import People from "@/utils/svg/People";
import Close from "@/utils/svg/Close";

const PATIENT_MENU_ITEMS: MenuItem[] = [
  {
    onPress: () => {
      router.replace("/home/patient/submitMedicalRecordRequest");
    },
    renderCustom: (onPress, onCloseMenu) => (
      <View className="w-full h-12 px-4 mt-4">
        <Button
          text="New Medical Request"
          onPress={() => {
            onCloseMenu();
            onPress();
          }}
        />
      </View>
    ),
  },
  {
    title: "Get records from MyChart",
    icon: () => <File />,
    onPress: () => {
      router.replace("/home/patient/connectMyChart");
    },
  },
  {
    title: "Contacts",
    icon: () => <People />,
    onPress: () => {
      router.replace("/home/patient/contacts");
    },
  },
  {
    title: "My Profile",
    icon: () => <UserLarge />,
    onPress: () => {
      router.replace("/home/patient/profile");
    },
  },
  {
    title: "My Medical Requests",
    icon: () => <File />,
    onPress: () => {
      router.replace("/home/patient");
    },
  },
  {
    title: "Ask RecordSpeed AI",
    icon: () => <People />,
    onPress: () => {
      router.push({ pathname: "/assistant", params: { from: "menu" } });
    },
  },
  {
    title: "Delete Account",
    icon: () => <Close />,
    onPress: () => {
      router.replace("/home/patient/deleteAccount");
    },
  },
  {
    title: "Sign Out",
    icon: () => <SignOut />,
    onPress: () => {
      router.replace("/sign_out");
    },
    last: true,
  },
];

const ATTORNEY_MENU_ITEMS: MenuItem[] = [
  {
    first: true,
    title: "Shared With Me",
    icon: () => <ArrowDown />,
    onPress: () => {
      router.replace("/home/attorney/");
    },
  },
  {
    title: "My Profile",
    icon: () => <UserLarge />,
    onPress: () => {
      router.replace("/home/attorney/profile");
    },
  },
  {
    title: "Ask RecordSpeed AI",
    icon: () => <People />,
    onPress: () => {
      router.push({ pathname: "/assistant", params: { from: "menu" } });
    },
  },
  {
    title: "Delete Account",
    icon: () => <Close />,
    onPress: () => {
      router.replace("/home/attorney/deleteAccount");
    },
  },
  {
    title: "Sign Out",
    icon: () => <SignOut />,
    onPress: () => {
      router.replace("/sign_out");
    },
    last: true,
  },
];

interface MenuItem {
  title?: string;
  icon?: () => ReactNode;
  onPress?: () => void;
  first?: boolean;
  last?: boolean;
  renderCustom?: (onPress: () => void, onCloseMenu: () => void) => ReactNode;
}

function MenuOption({
  title = "",
  icon = () => <></>,
  onPress = () => {},
  first = false,
  last = false,
}: MenuItem) {
  return (
    <Pressable
      className={`flex-row flex-1 justify-left h-14 items-center px-4 active:bg-gray-300 ${
        first ? "rounded-t-lg" : last ? "rounded-b-lg" : ""
      }`}
      onPress={onPress}
    >
      {icon()}
      <Text
        numberOfLines={1}
        className="inline-flex text-lg font-medium text-gray-900 pl-2"
      >
        {title}
      </Text>
    </Pressable>
  );
}

export default function MenuModal({
  onCloseMenu = () => {},
  menuType,
}: {
  menuType: AccountType;
  onCloseMenu: () => void;
}) {
  let menuItems = [];
  switch (menuType) {
    case "patient":
      menuItems = PATIENT_MENU_ITEMS;
      break;
    case "attorney":
      menuItems = ATTORNEY_MENU_ITEMS;
      break;
  }

  const renderMenu = (menuItems: MenuItem[]) => {
    return menuItems.map(
      ({ title, icon, onPress, renderCustom, first, last }, key) =>
        renderCustom ? (
          <Fragment key={key}>{renderCustom(onPress, onCloseMenu)}</Fragment>
        ) : (
          <MenuOption
            key={key}
            title={title}
            icon={icon}
            onPress={() => {
              onCloseMenu();
              onPress();
            }}
            first={first}
            last={last}
          />
        )
    );
  };

  return (
    <>
      <Pressable
        className="absolute w-full h-full flex items-end pr-10 top-0"
        onPress={onCloseMenu}
      />
      <View
        className={`absolute flex bg-white w-60 top-6 shadow-2xl rounded-lg right-10`}
      >
        {renderMenu(menuItems)}
      </View>
    </>
  );
}
