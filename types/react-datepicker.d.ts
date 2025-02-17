declare module 'react-datepicker' {
  import * as React from 'react';

  export interface ReactDatePickerProps {
    // Essential Props
    selected?: Date | null;
    onChange?: (date: Date | null, event?: React.SyntheticEvent<any>) => void;
    
    // Display Props
    dateFormat?: string | string[];
    timeFormat?: string;
    showTimeSelect?: boolean;
    showTimeSelectOnly?: boolean;
    timeIntervals?: number;
    timeCaption?: string;
    
    // Customization
    className?: string;
    calendarClassName?: string;
    popperClassName?: string;
    wrapperClassName?: string;
    
    // Placeholder and Clear
    placeholderText?: string;
    isClearable?: boolean;
    
    // Date Restrictions
    minDate?: Date;
    maxDate?: Date;
    filterDate?: (date: Date) => boolean;
    
    // Popper Options
    showPopperArrow?: boolean;
    
    // Additional Props
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    
    // Time Selection
    showTimeInput?: boolean;
    timeInputLabel?: string;
    inlineFocusSelectedMonth?: boolean;
    
    // Calendar Options
    inline?: boolean;
    peekNextMonth?: boolean;
    showMonthDropdown?: boolean;
    showYearDropdown?: boolean;
    dropdownMode?: 'scroll' | 'select';
    
    // Locale and Internationalization
    locale?: string | Locale;
    
    // Custom Components
    customInput?: React.ReactNode;
    
    // Events
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onSelect?: (date: Date, event: React.SyntheticEvent<any> | undefined) => void;
    onClickOutside?: (event: React.MouseEvent<HTMLDivElement>) => void;
    
    // Allow any other props
    [key: string]: any;
  }

  interface Locale {
    localize?: {
      day: (n: number) => string;
      month: (n: number) => string;
    };
    formatLong?: {
      date: (options: { width: string }) => string;
    };
    options?: {
      weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
      firstWeekContainsDate?: number;
    };
  }

  const ReactDatePicker: React.FC<ReactDatePickerProps>;
  export default ReactDatePicker;
} 