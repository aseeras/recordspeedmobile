import { useNavigation } from "expo-router";
import { useEffect } from "react";

export function useNavigationOptions({
  options,
  dependantKeys = [],
}: {
  options: Partial<{}>;
  dependantKeys?: any[];
}) {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions(options);
  }, [navigation, [...dependantKeys]]);
}
