import { View } from "react-native";
import UserSmall from "@/utils/svg/UserSmall";

export enum AvatarColors {
  orange = "#fb923c",
  green = "#4ade80",
  sky = "#38bdf8",
  indigo = "#818cf8",
  yellow = "#facc15",
  purple = "#c084fc",
  rose = "#fb7185",
}

export function getRandomAvatarColor() {
  const values = Object.values(AvatarColors);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

export default function Avatar({
  color = AvatarColors.yellow,
}: {
  color: AvatarColors;
}) {
  return (
    <View
      style={{
        backgroundColor: color,
      }}
      className={`h-10 w-10 rounded-md flex justify-center items-center`}
    >
      <UserSmall />
    </View>
  );
}
