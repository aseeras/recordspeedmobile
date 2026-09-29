import ChevronDown from "@/utils/svg/ChevronDown";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

type Option = {
  key: string;
  value: string;
};

export default function DropdownInput({
  initialValue = "",
  placeholder = "Select a value",
  handleValueChange = () => {},
  options = [],
}: {
  initialValue?: string;
  placeholder?: string;
  handleValueChange?: (value: string, option?: Option) => void;
  options: Array<Option>;
}) {
  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = query
    ? options.filter((option) =>
        option.value.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  return (
    <View className="relative z-10">
      <Pressable className="relative">
        <TextInput
          value={query}
          className="border rounded-md text-base border-gray-300 text-gray-400 pl-5 pr-4 py-3 mb-3"
          autoCapitalize="none"
          placeholder={placeholder}
          onChangeText={(text) => {
            setQuery(text);
            handleValueChange(text);
          }}
          onPress={() => setIsOpen(!isOpen)}
        />
        <View
          className={`absolute right-4 top-6 ${isOpen ? "rotate-180" : ""}`}
        >
          <ChevronDown />
        </View>
      </Pressable>

      {isOpen && (
        <View className="absolute top-14 w-full max-h-40 bg-white rounded-lg shadow-md">
          <ScrollView>
            {filteredOptions.map((option) => (
              <Pressable
                key={option.key}
                className="px-4 py-3"
                onPress={() => {
                  setQuery(option.value);
                  handleValueChange(option.value, option);
                  setIsOpen(false);
                }}
              >
                <Text className="text-base">{option.value}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
