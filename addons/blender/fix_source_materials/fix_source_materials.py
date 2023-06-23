import bpy

def setupGLTFFile():
    bpy.data.objects['Map'].scale.x = 0.1
    bpy.data.objects['Map'].scale.y = 0.1
    bpy.data.objects['Map'].scale.z = 0.1

def fixMaterial(material):
    doFix = any(node.label == "OCCLUSION" for node in material.node_tree.nodes)
    if doFix:
        group = material.node_tree.nodes.new('ShaderNodeGroup');
        group.label = "Mix Valve Source Textures";
        fixNodeGroup = bpy.data.node_groups['MixSourceTextures'];
        group.node_tree = fixNodeGroup;

        hasNormal = 'Normal Map' in material.node_tree.nodes

        color1Texture = material.node_tree.nodes['Image Texture']
        if hasNormal:
            normalTexture = material.node_tree.nodes['Image Texture.001']
            color2Texture = material.node_tree.nodes['Image Texture.002']
        else:
            color2Texture = material.node_tree.nodes['Image Texture.001']

        color2Texture.image.colorspace_settings.name = "sRGB";

        bsdf = material.node_tree.nodes['Principled BSDF']

        material.node_tree.links.new(bsdf.inputs['Base Color'], group.outputs['Color'])
        if hasNormal:
            material.node_tree.links.new(bsdf.inputs['Normal'], group.outputs['Normal'])

        material.node_tree.links.new(group.inputs['Color1'], color1Texture.outputs['Color'])
        material.node_tree.links.new(group.inputs['Color2'], color2Texture.outputs['Color'])
        if hasNormal:
            material.node_tree.links.new(group.inputs['Normal'], normalTexture.outputs['Color'])

    
class VSDFixCycles(bpy.types.Operator):
    bl_idname = "vsdfix.cycles"
    bl_label = "Fix Materials for Cycles"
    bl_description = "Fix Source Materials from VSource Decompiler"
    bl_options = {"REGISTER"}

    def execute(self, context):
        setupGLTFFile()

        for mat in bpy.data.materials:
            print(mat.name)
            fixMaterial(mat)

        return {"FINISHED"}


def register():
    from bpy.utils import register_class
    register_class(VSDFixCycles)

def unregister():
    from bpy.utils import unregister_class
    unregister_class(VSDFixCycles)

if __name__ == "__main__":
    register()