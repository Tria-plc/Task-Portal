import { sp } from "@pnp/sp/presets/all";

class TaskServices {
  public constructor(private listId: string) {}

  async getItems(extraFilter?: string, viewFields?: string) {
    let viewXml;
    if (extraFilter) {
      viewXml = `<View><Query><OrderBy><FieldRef Name='Created' Ascending='FALSE' /></OrderBy><Where><And><Or><Eq><FieldRef Name='AssignedTo' /><Value Type='Integer'><UserID/></Value></Eq><Membership Type='CurrentUserGroups'><FieldRef Name='AssignedTo' /></Membership></Or>${extraFilter}</And></Where></Query>${
        viewFields ? viewFields : ""
      }</View>`;
    } else
      viewXml = `<View><Query><OrderBy><FieldRef Name='Created' Ascending='FALSE' /></OrderBy><Where><Or><Eq><FieldRef Name='AssignedTo' /><Value Type='Integer'><UserID/></Value></Eq><Membership Type='CurrentUserGroups'><FieldRef Name='AssignedTo' /></Membership></Or></Where></Query>${
        viewFields ? viewFields : ""
      }</View>`;
    const items = await sp.web.lists.getById(this.listId).getItemsByCAMLQuery({
      ViewXml: viewXml,
    });
    console.log(items);
    return items;
  }

  async getItemById(id: number) {
    const item = await sp.web.lists.getById(this.listId).items.getById(id);

    return item;
  }

  async updateItemById(itemId: number, updatedData: any): Promise<string> {
    try {
      await sp.web.lists
        .getById("YourListName")
        .items.getById(itemId)
        .update(updatedData);
      console.log("Item updated successfully.");

      return "Item updated successfully.";
      // Optionally, you can perform additional actions after the item is updated
    } catch (error) {
      console.error("Error updating item by ID:", error);
      // Handle the error as needed
    }
  }
}

export default TaskServices;
