const applicationTheme = () => {
  return {
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: 'rgb(31 41 55)',
            padding: '6px 12px 6px 12px',
            borderRadius: '4px',
          },
          arrow: {
            color: 'rgb(31 41 55)',
            marginTop: '2px',
            marginLeft: '1px',
          },
        },
      },
    },
  }
}

export default applicationTheme
