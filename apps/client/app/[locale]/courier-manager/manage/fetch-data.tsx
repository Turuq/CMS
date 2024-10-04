import {
  handoverOfficers,
  assignmentOfficers,
  couriers,
} from "@/utils/data/dummy";

export async function fetchData(
  options: {
    pageIndex: number;
    pageSize: number;
  },
  activeTab: string,
) {
  console.log("Fetching data for tab: ", activeTab);
  // Fetch data based on the orderTab
  let data: {
    rows: any[];
    pageCount: number;
    rowCount: number;
  } = {
    rows: [],
    pageCount: 0,
    rowCount: 0,
  };
  switch (activeTab) {
    case "ضباط التسليم":
    case "Handover Officers":
      data = {
        rows: handoverOfficers.slice(
          options.pageIndex * options.pageSize,
          options.pageIndex * options.pageSize + options.pageSize,
        ),
        pageCount: Math.ceil(handoverOfficers.length / options.pageSize),
        rowCount: handoverOfficers.length,
      };
      break;
    case "ضباط التعيين":
    case "Assignment Officers":
      data = {
        rows: assignmentOfficers.slice(
          options.pageIndex * options.pageSize,
          options.pageIndex * options.pageSize + options.pageSize,
        ),
        pageCount: Math.ceil(assignmentOfficers.length / options.pageSize),
        rowCount: assignmentOfficers.length,
      };
      break;
    case "المناديب":
    case "Couriers":
      data = {
        rows: couriers.slice(
          options.pageIndex * options.pageSize,
          options.pageIndex * options.pageSize + options.pageSize,
        ),
        pageCount: Math.ceil(couriers.length / options.pageSize),
        rowCount: couriers.length,
      };
  }

  return data;
}

export async function getHandoverOfficerById(id: number) {
  return handoverOfficers.find((officer) => officer.id === id);
}

export async function getAssignmentOfficerById(id: number) {
  return assignmentOfficers.find((officer) => officer.id === id);
}

export async function getCourierById(id: number) {
  return couriers.find((courier) => courier.id === id);
}

export async function updateHandoverOfficer(officer: any) {
  console.log("Updating handover officer with id: ", officer.id);
  const index = handoverOfficers.findIndex((o) => o.id === officer.id);
  handoverOfficers[index] = officer;
}

export async function updateAssignmentOfficer(officer: any) {
  console.log("Updating assignment officer with id: ", officer.id);
  const index = assignmentOfficers.findIndex((o) => o.id === officer.id);
  assignmentOfficers[index] = officer;
}

export async function updateCourier(courier: any) {
  console.log("Updating courier with id: ", courier.id);
  const index = couriers.findIndex((c) => c.id === courier.id);
  couriers[index] = courier;
}

export async function addHandoverOfficer(officer: any) {
  console.log("Adding handover officer: ", officer);
  handoverOfficers.push(officer);
}

export async function addAssignmentOfficer(officer: any) {
  console.log("Adding assignment officer: ", officer);
  assignmentOfficers.push(officer);
}

export async function addCourier(courier: any) {
  console.log("Adding courier: ", courier);
  couriers.push(courier);
}

export async function deleteHandoverOfficer(id: number) {
  console.log("Deleting handover officer with id: ", id);
  const index = handoverOfficers.findIndex((o) => o.id === id);
  handoverOfficers.splice(index, 1);
}

export async function deleteAssignmentOfficer(id: number) {
  console.log("Deleting assignment officer with id: ", id);
  const index = assignmentOfficers.findIndex((o) => o.id === id);
  assignmentOfficers.splice(index, 1);
}

export async function deleteCourier(id: number) {
  console.log("Deleting courier with id: ", id);
  const index = couriers.findIndex((c) => c.id === id);
  couriers.splice(index, 1);
}
