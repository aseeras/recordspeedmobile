import React from "react";

export default function JoinedList({ items, divider, prefix }) {
  return items.reduce((acc, item, index) => {
    if (index === 0)
      return [React.cloneElement(item, { key: `${prefix}-item-${index}` })];
    return [
      ...acc,
      React.cloneElement(divider, { key: `${prefix}-divider-${index}` }),
      React.cloneElement(item, { key: `${prefix}-item-${index}` }),
    ];
  }, []);
}
