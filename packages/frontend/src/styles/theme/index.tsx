import {
  createTheme,
  MantineProvider,
  MantineThemeOverride,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { DatesProvider } from "@mantine/dates";
import React, { createContext, ReactNode, useContext } from "react";
import themeColors from "./colors";

import "./components.css";

const theme: MantineThemeOverride = createTheme({
  fontFamily: "Inter, sans-serif",
  ...themeColors,

  spacing: {
    xxs: "0.25rem", // 4px
  },

  headings: {
    textWrap: "nowrap",
    sizes: {
      h6: {
        fontSize: ".75rem",
      },
    },
  },

  components: {
    AppShell: {
      defaultProps: {
        bg: "var(--mantine-color-background-0)",
        style: {
          height: "100vh",
        },
      },
    },
    AppShellMain: {
      defaultProps: {
        w: "100dvw",
        h: "100dvh",
        style: {
          overflow: "auto",
          position: "relative",
        },
      },
    },
    NavLink: {
      defaultProps: {
        px: "12",
        py: "8",
      },
    },
    InputText: {
      defaultProps: {
        size: "md",
      },
    },
    Switch: {
      defaultProps: {
        styles: {
          WebkitTapHighlightColor: "transparent",
        },
      },
    },
    Card: {
      defaultProps: {
        shadow: "sm",
        radius: "md",
      },
    },
  },
});

interface IThemeContextType {}

const ThemeContext = createContext<IThemeContextType | undefined>(undefined);

interface IThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<IThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={{}}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <DatesProvider settings={{ firstDayOfWeek: 0, timezone: "UTC" }}>
          <Notifications position="top-right" />
          {children}
        </DatesProvider>
      </MantineProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeContext");
  }
  return context;
};
