import React from 'react';

// Фабрика компонента-заглушки
const createIconMock = (name: string) => {
  const IconComponent = () =>
    React.createElement('span', { 'data-testid': `icon-${name}` }, name);
  return IconComponent;
};

// Прокси-объект, эмулирующий модуль с default и именованными экспортами
const moduleProxy = new Proxy(
  {},
  {
    get(_, prop) {
      if (prop === '__esModule') return true;
      if (prop === 'default') return moduleProxy; // default экспорт указывает на сам прокси
      return createIconMock(String(prop));
    },
  }
);

// Экспорт по умолчанию для поддержки import ... from '...'
export default moduleProxy;
