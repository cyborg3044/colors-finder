const formatRgb = (rgb) => {
  return `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
};
const formatHsl = (hsl) => {
  return `${hsl[0]}, ${hsl[1]}, ${hsl[2]}`;
};

function ColourTable({ colours }) {
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Hex</th>
          <th>RGB</th>
          <th>HSL</th>
        </tr>
      </thead>
      <tbody>
        {colours.map((item, key) => {
          return (
            <tr key={key}>
              <td
                style={{ "background-color": `${item.hex}`, padding: "10px" }}
              ></td>

              <td>{item.color}</td>
              <td>{item.hex}</td>
              <td>{formatRgb(item.RGB)}</td>
              <td>{formatHsl(item.HSL)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ColourTable;
