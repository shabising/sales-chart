import { createContext, useContext, useReducer, useEffect } from 'react';

const FilterContext = createContext(null);

const initialState = {
  filters: JSON.parse(localStorage.getItem('filters')) || {
    quarter:  'all',
    category: 'all',
    region:   'all',
    minSales: 0,
  },
  darkMode: JSON.parse(localStorage.getItem('darkMode')) || false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.key]: action.value },
      };
    case 'TOGGLE_DARK':
      return { ...state, darkMode: !state.darkMode };
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters };
    default:
      return state;
  }
}

export function FilterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem('filters', JSON.stringify(state.filters));
  }, [state.filters]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
    document.body.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  return (
    <FilterContext.Provider value={{ state, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilterContext must be used within FilterProvider');
  return ctx;
}