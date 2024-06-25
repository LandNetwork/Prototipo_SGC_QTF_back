export function dtoToInsert(toInsert: any) {
  return toInsert.reduce((acc: any, { column_name, value }: { column_name: string; value: any }) => {
    acc[column_name] = value;
    return acc;
  }, {});
}
