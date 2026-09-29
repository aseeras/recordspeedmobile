import Eye from "@/utils/svg/Eye";
import React, { useState } from "react";
import {
  Text,
  TextInput as BaseInput,
  TextInputProps,
  TextProps,
  View,
  ViewProps,
} from "react-native";
import * as changeCase from "change-case";

export function Label({
  field,
  required = false,
  children,
  ...props
}: TextProps & { field?: any; required?: boolean }) {
  return (
    <Text className="text-base text-gray-700 font-medium" {...props}>
      {children || (field ? changeCase.capitalCase(field.name) : "")}{" "}
      {required && <Text className="text-red-500">*</Text>}
    </Text>
  );
}

// TanStack Form v1 dropped `touchedErrors`; errors can be strings or Standard Schema issues.
function touchedErrors(meta: any): string[] {
  if (!meta?.isTouched) return [];
  return (meta.errors ?? [])
    .flat()
    .map((error: any) => (typeof error === "string" ? error : error?.message))
    .filter(Boolean);
}

export function FieldInfo({ field }: { field: any }) {
  const errors = touchedErrors(field.state.meta);
  if (errors.length <= 0) return null;
  return <Text className="text-red-600 -mt-1">{errors.join(", ")}</Text>;
}

export function FieldsInfo({ fields }: { fields: any[] }) {
  const errors = fields.map(touchedErrors).flat();
  if (errors.length <= 0) return null;
  return <Text className="text-red-600 -mt-1">{errors.join(", ")}</Text>;
}

export const TextInput = React.forwardRef<
  BaseInput,
  TextInputProps & { field: any }
>(({ field, secureTextEntry, ...props }, ref) => {
  const [hide, setHide] = useState(secureTextEntry);
  return (
    <View className="relative">
      <BaseInput
        ref={ref}
        value={field.state.value}
        className="border rounded-md text-base leading-5 border-gray-300 text-gray-400 px-5 py-3"
        autoCapitalize="none"
        placeholder={changeCase.capitalCase(field.name)}
        onChangeText={(text) => field.handleChange(text)}
        secureTextEntry={hide}
        {...props}
      />
      {secureTextEntry && (
        <View
          className="absolute right-4 top-3 pt-1 pl-1 bg-white"
          onTouchEnd={() => setHide(!hide)}
        >
          <Eye />
        </View>
      )}
    </View>
  );
});

// {
//   const [hide, setHide] = useState(secureTextEntry);
//   const Component = React.forwardRef<
//     BaseInput,
//     TextInputProps & { field: any }
//   >(({ field, secureTextEntry, ...props }, ref) => {
//     return (
//       <View className="relative">
//         <BaseInput
//           ref={ref}
//           value={field.state.value}
//           className="border rounded-md text-base leading-5 border-gray-300 text-gray-400 px-5 py-3"
//           autoCapitalize="none"
//           placeholder={changeCase.capitalCase(field.name)}
//           onChangeText={(text) => field.handleChange(text)}
//           secureTextEntry={hide}
//           {...props}
//         />
//         {secureTextEntry && (
//           <View
//             className="absolute right-4 top-3 pt-1 pl-1 bg-white"
//             onTouchEnd={() => setHide(!hide)}
//           >
//             <Eye />
//           </View>
//         )}
//       </View>
//     );
//   });
//   return <Component {...props} />;
//   return (
//     <View className="relative">
//       <BaseInput
//         value={field.state.value}
//         className="border rounded-md text-base leading-5 border-gray-300 text-gray-400 px-5 py-3"
//         autoCapitalize="none"
//         placeholder={changeCase.capitalCase(field.name)}
//         onChangeText={(text) => field.handleChange(text)}
//         secureTextEntry={hide}
//         {...props}
//       />
//       {secureTextEntry && (
//         <View
//           className="absolute right-4 top-3 pt-1 pl-1 bg-white"
//           onTouchEnd={() => setHide(!hide)}
//         >
//           <Eye />
//         </View>
//       )}
//     </View>
//   );
// }

export function FieldWrapper({ children, ...props }: ViewProps) {
  return (
    <View style={{ gap: 8 }} {...props}>
      {children}
    </View>
  );
}
