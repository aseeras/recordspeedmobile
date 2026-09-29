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
    // Spread the keys so the effect only re-runs when one of them changes;
    // a fresh array literal here would re-run it (and re-render) every render.
  }, [navigation, ...dependantKeys]);
}
