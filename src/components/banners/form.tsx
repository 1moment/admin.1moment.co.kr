import type { BannerMutationData } from "@/hooks/use-banners.tsx";

import * as React from "react";

import { Subheading } from "@/components/ui/heading.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Select } from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";

import useFileUploadMutation from "@/hooks/use-file-upload-mutation.tsx";

export default function BannersForm({
  isLoading,
  banner,
  onSubmit,
}: { banner?: Banner; onSubmit: (data: BannerMutationData) => void }) {
  const [imageUrl, setImageUrl] = React.useState(banner?.imageUrl);
  const [mobileImageUrl, setMobileImageUrl] = React.useState(
    banner?.mobileImageUrl,
  );

  const { mutate: fileUpload } = useFileUploadMutation();

  return (
    <form
      className="divide-y divide-gray-900/10"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        onSubmit({
          title: formData.get("title") as string,
          position: String(formData.get("position")),
          link: formData.get("link") as string,
          sequence: Number(formData.get("sequence")),
          status: formData.get("status") as string,
          imageUrl,
          mobileImageUrl,
        });
      }}
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <Subheading>기본정보</Subheading>
          <Text />
        </div>
        <FieldGroup className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <Field>
            <Label>
              타이틀&nbsp;<span className="text-red-400">*</span>
            </Label>
            <Input name="title" defaultValue={banner?.title} />
          </Field>

          <Field>
            <Label>
              위치&nbsp;<span className="text-red-400">*</span>
            </Label>
            <Select name="position" defaultValue={banner?.position || "TOP"}>
              <option value="TOP">상단</option>
              <option value="MIDDLE">중간</option>
              <option value="BOTTOM">하단</option>
            </Select>
          </Field>

          <Field>
            <Label>
              링크&nbsp;<span className="text-red-400">*</span>
            </Label>
            <Input name="link" defaultValue={banner?.link} />
          </Field>

          <Field>
            <Label>
              순서&nbsp;<span className="text-red-400">*</span>
            </Label>
            <Input name="sequence" defaultValue={banner?.sequence} />
          </Field>

          <Field>
            <Label>
              PC 이미지&nbsp;<span className="text-red-400">*</span>
            </Label>
            <Input type="hidden" name="imageUrl" value={imageUrl} />
            <img src={imageUrl} alt="" />
            <Input
              className="mt-3"
              type="file"
              accept="image/*"
              onChange={({ target, currentTarget: { files } }) => {
                if (files?.[0]) {
                  fileUpload(files[0], {
                    onSuccess(data) {
                      setImageUrl(data.url);
                    },
                    onSettled() {
                      target.value = "";
                    },
                  });
                }
              }}
            />
          </Field>

          <Field>
            <Label className="shrink-0">
              모바일 이미지&nbsp;<span className="text-red-400">*</span>
            </Label>
            <Input type="hidden" name="mobileImageUrl" value={mobileImageUrl} />
            <img src={mobileImageUrl} alt="" />
            <Input
              className="mt-3"
              type="file"
              accept="image/*"
              onChange={({ target, currentTarget: { files } }) => {
                if (files?.[0]) {
                  fileUpload(files[0], {
                    onSuccess(data) {
                      setMobileImageUrl(data.url);
                    },
                    onSettled() {
                      target.value = "";
                    },
                  });
                }
              }}
            />
          </Field>
        </FieldGroup>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <Subheading>상태</Subheading>
          <Text />
        </div>
        <FieldGroup className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <Field>
            <Select name="status" defaultValue={banner?.status || "DRAFT"}>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="DRAFT">DRAFT</option>
            </Select>
          </Field>
        </FieldGroup>
      </div>

      <div className="mt-10 flex justify-end">
        <Button isLoading={isLoading} type="submit">저장</Button>
      </div>
    </form>
  );
}
