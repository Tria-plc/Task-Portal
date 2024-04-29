import SPService from "./SPServices";

/**
 *
 * @param array
 * @returns array of departments with a divider by level
 */
const addDivider = (array) => {
  let level = 1;
  return array.reduce((acc, obj) => {
    if (parseInt(obj.Level) !== level) {
      level = obj.Level;
      const newObj = {
        label: "-------------------",
        value: "divider",
        Name: "------------------------------",
        Path: "",
      };
      acc.push(newObj);
    }
    acc.push(obj);
    return acc;
  }, []);
};

const getDepartments = async (service: SPService, description) => {
  let result: any = await service.getDepartmentsFromAD(description.toString());
  let data = result;
  (data = data.map((obj) => ({
    ...obj,
    label: obj.Name,
    value: obj.Guid,
  }))),
    (data = data
      .map((obj) => {
        obj.Path = obj.Path.replace(/\\/g, "");
        obj.Name = obj.Name.replace(/\\/g, "");
        obj.label = obj.label.replace(/\\/g, "").replace(/የ/, "ለ");
        return obj;
      })
      .sort((a, b) => a.Level - b.Level));
  data = addDivider(data);

  return data;
};

export { getDepartments };
