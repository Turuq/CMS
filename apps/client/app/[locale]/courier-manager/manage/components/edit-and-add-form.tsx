"use client";
import { useState } from "react";
import { Info, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import DragNDrop from "./drag-and-drop";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { OfficerType } from "@/types/officers";
import {
  updateHandoverOfficer,
  updateAssignmentOfficer,
  updateCourier,
  addHandoverOfficer,
  addAssignmentOfficer,
  addCourier,
} from "../fetch-data";

type RowType = {
  name: string;
  phoneNumber: string;
  username?: string;
  email?: string;
  salary: number;
  zone: string;
  commissionPerOrder: number;
  nationalIDImage: string;
  licenseImage?: string;
  criminalRecord: string;
};

interface FormProps {
  isAdding: boolean;
  setIsAdding: (isAdding: boolean) => void;
  selectedRow?: RowType;
  setSelectedRow?: (row: RowType | null) => void;
  dict: any;
  tabs: {
    handoverOfficers: string;
    assignmentOfficers: string;
    couriers: string;
  };
  activeTab: string;
}

export default function Form({
  isAdding,
  setIsAdding,
  selectedRow,
  setSelectedRow,
  dict,
  tabs,
  activeTab,
}: FormProps) {
  let emptyRow: any = {};
  switch (activeTab) {
    case tabs.handoverOfficers:
    case tabs.assignmentOfficers:
      emptyRow = {
        name: "",
        phoneNumber: "",
        email: "",
        salary: 0,
        zone: "",
        commissionPerOrder: 0,
        nationalIDImage: "",
        criminalRecord: "",
      };
      break;
    case tabs.couriers:
      emptyRow = {
        name: "",
        phoneNumber: "",
        username: "",
        salary: 0,
        zone: "",
        commissionPerOrder: 0,
        nationalIDImage: "",
        licenseImage: "",
        criminalRecord: "",
      };
      break;
  }

  const [data, setData] = useState<RowType>(selectedRow || emptyRow);

  const inputClassname = (valid: boolean | null) => {
    const commonClasses = `focus-visible:ring-0 focus-visible:ring-offset-0`;
    return (
      commonClasses +
      (valid === null ? "" : valid ? "border-green-500" : "border-red-500")
    );
  };

  const handleSave = async () => {
    try {
      if (activeTab === tabs.handoverOfficers) {
        if (!isAdding) {
          await updateHandoverOfficer(data);
        } else {
          await addHandoverOfficer(data);
          setIsAdding(false);
        }
      } else if (activeTab === tabs.assignmentOfficers) {
        if (!isAdding) {
          await updateAssignmentOfficer(data);
        } else {
          await addAssignmentOfficer(data);
          setIsAdding(false);
        }
      } else if (activeTab === tabs.couriers) {
        if (!isAdding) {
          await updateCourier(data);
        } else {
          await addCourier(data);
          setIsAdding(false);
        }
      }

      if (setSelectedRow) setSelectedRow(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (setSelectedRow) setSelectedRow(null);
    setIsAdding(false);
  };

  return (
    <div className="w-full ">
      {selectedRow && (
        <div
          id="header"
          className="px-12 flex flex-col justify-center items-center gap-2"
        >
          <h1 className="text-2xl font-bold text-accent">{selectedRow.name}</h1>
          <p className="text-sm flex items-center justify-center gap-1">
            <Phone size={16} /> {selectedRow.phoneNumber}
          </p>
          {selectedRow.email && (
            <p className="text-sm flex items-center justify-center gap-1">
              <Mail size={16} /> {selectedRow.email}
            </p>
          )}
          {selectedRow.username && (
            <p className="text-sm flex items-center justify-center gap-1">
              {selectedRow.username}
            </p>
          )}
        </div>
      )}
      <div id="inputs" className="flex flex-col gap-8 mt-4">
        <div className="flex flex-row flex-wrap justify-around gap-y-8 items-center">
          <div className="w-full lg:w-[25%]">
            <label
              htmlFor="name"
              className="text-xs text-black dark:text-white/50"
            >
              {dict["name"]}
            </label>
            <Input
              id="name"
              value={data.name}
              className={inputClassname(null)}
              placeholder={dict["name"]}
              type="text"
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>

          <div className="w-full lg:w-[25%]">
            <label
              htmlFor="phone"
              className="text-xs text-black dark:text-white/50"
            >
              {dict["phoneNumber"]}
            </label>
            <Input
              value={data.phoneNumber}
              id="phone"
              className={inputClassname(null)}
              placeholder={dict["phoneNumber"]}
              type="tel"
              onChange={(e) =>
                setData({
                  ...data,
                  phoneNumber: e.target.value,
                })
              }
            />
          </div>
          {activeTab !== tabs.couriers && (
            <div className="w-full lg:w-[25%]">
              <label
                htmlFor="email"
                className="text-xs text-black dark:text-white/50"
              >
                {dict["email"]}
              </label>
              <Input
                id="email"
                value={data.email}
                className={inputClassname(null)}
                placeholder={dict["email"]}
                type="email"
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
          )}
          {activeTab === tabs.couriers && (
            <div className="w-full lg:w-[25%]">
              <label
                htmlFor="username"
                className="text-xs text-black dark:text-white/50"
              >
                {dict["username"]}
              </label>
              <Input
                id="username"
                value={data.username}
                className={inputClassname(null)}
                placeholder={dict["username"]}
                type="text"
                onChange={(e) => setData({ ...data, username: e.target.value })}
              />
            </div>
          )}
        </div>
        <div className="flex flex-row flex-wrap gap-y-8 justify-around items-center">
          <div className="w-full lg:w-[25%]">
            <label
              htmlFor="salary"
              className="text-xs text-black dark:text-white/50"
            >
              {dict["salary"]}
            </label>
            <Input
              id="salary"
              value={data.salary}
              className={inputClassname(null)}
              placeholder={dict["salary"]}
              type="text"
              onChange={(e) =>
                setData({
                  ...data,
                  salary: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="w-full lg:w-[25%]">
            <label
              htmlFor="zone"
              className="text-xs text-black dark:text-white/50"
            >
              {dict["zone"]}
            </label>
            <Input
              id="zone"
              value={data.zone}
              className={inputClassname(null)}
              placeholder={dict["zone"]}
              type="text"
              onChange={(e) => setData({ ...data, zone: e.target.value })}
            />
          </div>
          <div className="w-full lg:w-[25%]">
            <label
              htmlFor="commPerOrder"
              className="text-xs text-black dark:text-white/50"
            >
              {dict["commissionPerOrder"]}
            </label>
            <Input
              id="commPerOrder"
              value={data.commissionPerOrder}
              className={inputClassname(null)}
              placeholder={dict["commissionPerOrder"]}
              type="text"
              onChange={(e) =>
                setData({
                  ...data,
                  commissionPerOrder: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-y-8 justify-around items-center">
          <div className="w-full lg:w-[30%]">
            <label
              htmlFor=""
              className="text-xs w-full  text-black dark:text-white/50 flex justify-between items-center"
            >
              <span>{dict["nationalID"]}</span>
              <HoverCard>
                <HoverCardTrigger asChild className="w-fit">
                  <Button variant="link">
                    <Info />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-1">
                    <p>you can drop image to upload it</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </label>
            <DragNDrop
              parentOnDrop={(acceptedFiles: any) => console.log(acceptedFiles)}
            />
          </div>

          {activeTab === tabs.couriers && (
            <div className="w-full lg:w-[30%]">
              <label
                htmlFor=""
                className="text-xs w-full  text-black dark:text-white/50 flex justify-between items-center"
              >
                <span>{dict["licenseImage"]}</span>
                <HoverCard>
                  <HoverCardTrigger asChild className="w-fit">
                    <Button variant="link">
                      <Info />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-1">
                      <p>you can drop image to upload it</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </label>
              <DragNDrop
                imageUrl={data.licenseImage}
                parentOnDrop={(acceptedFiles: any) =>
                  console.log(acceptedFiles)
                }
              />
            </div>
          )}

          <div className="w-full lg:w-[30%]">
            <label
              htmlFor=""
              className="text-xs w-full  text-black dark:text-white/50 flex justify-between items-center"
            >
              <span>{dict["criminalRec"]}</span>
              <HoverCard>
                <HoverCardTrigger asChild className="w-fit">
                  <Button variant="link">
                    <Info />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-1">
                    <p>you can drop image to upload it</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </label>
            <DragNDrop
              imageUrl="https://img.freepik.com/free-photo/anime-style-galaxy-background_23-2151133974.jpg"
              parentOnDrop={(acceptedFiles: any) => console.log(acceptedFiles)}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 mt-8">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
