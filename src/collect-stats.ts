import * as cp from "child_process";

const hookNames = [
  "useCallback",
  "useContext",
  "useDebugValue",
  "useEffect",
  "useImperativeHandle",
  "useLayoutEffect",
  "useMemo",
  "useReducer",
  "useRef",
  "useState",
];

export async function collectStats(
  absolutePath: string
): Promise<Array<{ name: string; value: number; ratio: number }>> {
  const data = await Promise.all(
    hookNames.map(async (hook) => {
      return {
        name: hook,
        value: await getStatsForOne(absolutePath, hook),
      };
    })
  );

  const maxValue = Math.max(...data.map((d) => d.value));
  const dataWithRatio = data.map((d) => ({
    name: d.name,
    value: d.value,
    ratio: d.value / maxValue,
  }));

  return dataWithRatio;
}

async function getStatsForOne(path: string, name: string): Promise<number> {
  return new Promise<number>((resolve) => {
    cp.exec(`grep -ro ${name} ${path} | wc -w`, (err, r) => {
      resolve(parseInt(r.trim(), 10));
    });
  });
}
