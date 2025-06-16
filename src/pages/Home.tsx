import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar22 } from "@/components/ui/DatePicker";
import { BarChartComponent } from "@/custom-components/CustomCharts";
import DialogWrapper from "@/custom-components/CustomDialog";
import { CustomDropdown } from "@/custom-components/CustomDropdown";
import CustomButton from "@/custom-components/CustomeButton";
import { PieChartCard } from "@/custom-components/PieChartCard";
import { LineChartCard } from "@/custom-components/LineChartComponent";
import { Apple, PlusIcon } from "lucide-react";
import React from "react";
import { Progress } from "@/components/ui/progress";

const Home: React.FC = () => {
  return (
    <div className="home-page gap-y-3 flex flex-col items-center ">
      <h1>Welcome to Equinxt</h1>
      <p className="text-2xl font-bold text-red-500">
        This is the home page of our application.
      </p>
      <Button className="text-black">Click me</Button>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Calendar22 />
      <DialogWrapper
        trigger={<Button className="text-black">Open Dialog</Button>}
      >
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Custom Content</h2>
          <p>This is fully customizable JSX inside the dialog.</p>
        </div>
      </DialogWrapper>
      <CustomButton
        className="text-black"
        layout="theme_black"
        icon={<PlusIcon />}
        isLoading={false}
      >
        Submit
      </CustomButton>

      <CustomDropdown
        options={[
          { label: "Option A", value: "a", icon: <Apple size={16} /> },
          { label: "Option B", value: "b", icon: <Apple size={16} /> },
        ]}
        selectedValue={{ label: "Option A", value: "a" }}
        onChange={(val) => console.log("Selected:", val)}
        isSearchable
        leftChild={<span className="text-xs">🔽</span>}
      />

      <BarChartComponent />
      <PieChartCard />
      <LineChartCard />
      <Progress value={33} />
    </div>
  );
};

export default Home;
