import * as React from "react";
import { Subheading } from "@/components/ui/heading.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Divider } from "@/components/ui/divider.tsx";
import { Editor } from "@/components/ui/editor.tsx";

export default function ProductContentBlockForm({ formData }) {
  return (
    <form
      id="product-content-block-form"
      className="mt-8 p-4 border border-gray-100 rounded shadow"
    >
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>기본정보</Subheading>
          <Text>현재 템플릿의 기본 정보</Text>
        </div>
        <div>
          <FieldGroup>
            <Field>
              <Label>타이틀</Label>
              <Input value={formData.title} />
            </Field>
          </FieldGroup>
        </div>
      </section>

      <Divider className="my-10" />
      <section>
        <FieldGroup>
          <Field>
            <Label>내용</Label>
            <Editor content={formData.content} />
          </Field>
        </FieldGroup>
      </section>
    </form>
  );
}
