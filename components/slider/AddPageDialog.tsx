import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    // SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CanvasGridConfig, CanvasPageConfig } from "@/components/canvas/types"
import { BLANK_GRID_MARGIN, LOGO_PAGE_GRIDS_CONFIG, LOGO_PAGE_HEIGHT, NEW_PAGE_GRID_CONFIG } from "@/components/canvas/constant"

let GlobalPageId = 1;

export function TemplateSelect({ value, onChange }: { value: string, onChange: (value: string) => void }) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="blank">Blank</SelectItem>
                    {/* <SelectItem value="logo">Logo Page</SelectItem> */}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

const AddPageDialog: React.FC<{ children: React.ReactNode, onSubmit: (data: CanvasPageConfig) => void }> = ({ children, onSubmit }) => {
    const [open, setOpen] = React.useState(false);
    const [id, setId] = useState("");
    const [height, setHeight] = useState(LOGO_PAGE_HEIGHT);
    const [heightDisable, setHeightDisable] = useState(false);
    const [template, setTemplate] = useState("blank");

    const onTemplateChange = (value: string) => {
        if (value === "logo") {
            setHeight(LOGO_PAGE_HEIGHT);
            setHeightDisable(true);
        } else {
            setHeightDisable(false);
        }
        setTemplate(value)
    }

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        if (!template || !height) {
            console.error("Incorrect input");
        }
        const grids = template == "logo" ? LOGO_PAGE_GRIDS_CONFIG.map((grid, index) => {
            return {
                ...grid,
                id: id + ":" + index
            }
        }) : [
            {
                ...NEW_PAGE_GRID_CONFIG,
                rb_y: height - BLANK_GRID_MARGIN,
                id: id + ":" + 0
            }
        ] as CanvasGridConfig[];
        onSubmit({
            id,
            height,
            grids
        });
        setOpen(false);
        GlobalPageId++;
        event.preventDefault();
    }

    useEffect(() => {
        if (open) {
            setId("page" + GlobalPageId);
        }
    }, [open]);

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Page</DialogTitle>
                        <DialogDescription>
                            Please fill in the page info and select a template. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="pageid" className="text-right">
                                Page Id
                            </Label>
                            <Input id="pageid" value={id} className="col-span-3" onChange={(e) => setId(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="height" className="text-right">
                                Height
                            </Label>
                            <Input id="height" value={height} className="col-span-3" onChange={(e) => setHeight(Number(e.target.value))} disabled={heightDisable} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="height" className="text-right">
                                Template
                            </Label>
                            <TemplateSelect value={template} onChange={onTemplateChange} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleClick}>submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddPageDialog
