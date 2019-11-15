function Uint32ToBytes(int) {
    const bytes = [0, 0, 0, 0];

    bytes[0] = (int >> 24) & 0xFF;
    bytes[1] = (int >> 16) & 0xFF;
    bytes[2] = (int >> 8) & 0xFF;
    bytes[3] = int & 0xFF;

    return bytes.reverse();
}

function bytesToInteger(bytes) {
    return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
}

function bytesToFloat(bytes) {
    return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
}

function bytesToShort(bytes) {
    return (bytes[0] << 8) | bytes[1];
}

export default class BSPFile {

    static get known_types() {
        return ["VBSP"];
    }

    static get supported_version() {
        return 21;
    }

    static get STRUCT() {
        return {
            dplane_t: {
                normal: 'vector',
                dist: 'float',
                type: 'int'
            },
            dface_t: {
                planenum: 'unsigned short',
                side: 'byte',
                onNode: 'byte',
                firstedge: 'int',
                numedges: 'short',
                texinfo: 'short',
                dispinfo: 'short',
                surfaceFogVolumeID: 'short',
                styles: 'byte[4]',
                lightofs: 'int',
                area: 'float',
                LightmapTextureMinsInLuxels: 'int[2]',
                LightmapTextureSizeInLuxels: 'int[2]',
                origFace: 'int',
                numPrims: 'unsigned short',
                firstPrimID: 'unsigned short',
                smoothingGroups: 'unsigned int',
            },
            vertex: {
                x: 'float',
                y: 'float',
                z: 'float',
            },
            dedge_t: {
                v: 'unsigned short[2]'
            },
            surfedge: {
                v: 'int'
            },
            dbrush_t: {
                firstside: 'int',
                numsides: 'int',
                contents: 'int',
            },
            dbrushside_t: {
                planenum:'unsigned short',
                texinfo: 'short',
                dispinfo: 'short',
                bevel: 'short',
            },
            dnode_t: {
                planenum: 'int',
                children: 'int',
                mins: 'short',
                maxs: 'short',
                firstface: 'unsigned short',
                numfaces: 'unsigned short',
                area: 'short',
                paddding: 'short',
            },
            dleaf_t: {
                contents: 'int',
                cluster: 'short',
                area: 'short:9',
                flags: 'short:7',
                mins: 'int[3]',
                maxs: 'int[3]',
                firstleafface: 'unsigned short',
                numleaffaces: 'unsigned short',
                firstleafbrush: 'unsigned short',
                numleafbrushes: 'unsigned short',
                leafWaterDataID: 'short',
            },
            texinfo_t: {
                textureVecs: 'float[2][4]',
                lightmapVecs: 'float[2][4]',
                flags: 'int',
                texdata: 'int',
            },
            dtexdata_t: {
                reflectivity: 'vector',
                nameStringTableID: 'int',
                width_height: 'int, int',
                view_width_view_height: 'int, int'
            },
            dmodel_t: {
                mins_maxs: 'vector, vector',
                origin: 'vector',
                headnode: 'int',
                firstface_numfaces: 'int, int'
            },
            ddispinfo_t: {
                startPosition: 'vector',
                DispVertStart: 'int',
                DispTriStart: 'int',
                power: 'int',
                minTess: 'int',
                smoothingAngle: 'float',
                contents: 'int',
                MapFace: 'unsigned short',
                LightmapAlphaStart: 'int',
                LightmapSamplePositionStart: 'int',
                EdgeNeighbors: 'CDispNeighbor[4]',
                DispVertStart: 'CDispCornerNeighbors[4]',
                AllowedVerts: 'unsigned int[10]',
            },
            dDispVert: {
                vec: 'vector',
                dist: 'float',
                alpha: 'float',
            },
            dDispTri: {
                Tags: 'unsigned short'
            }
        }
    }

    static get LUMP() {
        return {
            ENTITIES: 0,
            PLANES: 1,
            TEXDATA: 2,
            VERTEXES: 3,
            VISIBILITY: 4,
            NODES: 5,
            TEXINFO: 6,
            FACES: 7,
            LIGHTING: 8,
            OCCLUSION: 9,
            LEAFS: 10,
            FACEIDS: 11,
            EDGES: 12,
            SURFEDGES: 13,
            MODELS: 14,
            WORLDLIGHTS: 15,
            LEAFFACES: 16,
            LEAFBRUSHES: 17,
            BRUSHES: 18,
            BRUSHSIDES: 19,
            AREAS: 20,
            AREAPORTALS: 21,
            PORTALS: 22,
            UNUSED0: 22,
            PROPCOLLISION: 22,
            CLUSTERS: 23,
            UNUSED26: 23,
            PROPHULLS: 23,
            PORTALVERTS: 24,
            UNUSED2: 24,
            PROPHULLVERTS: 24,
            CLUSTERPORTALS: 25,
            UNUSED3: 25,
            PROPTRIS: 25,
            DISPINFO: 26,
            ORIGINALFACES: 27,
            PHYSDISP: 28,
            PHYSCOLLIDE: 29,
            VERTNORMALS: 30,
            VERTNORMALINDICES: 31,
            DISP_LIGHTMAP_ALPHAS: 32,
            DISP_VERTS: 33,
            DISP_LIGHTMAP_SAMPLE_POSITIONS: 34,
            GAME_LUMP: 35,
            LEAFWATERDATA: 36,
            PRIMITIVES: 37,
            PRIMVERTS: 38,
            PRIMINDICES: 39,
            PAKFILE: 40,
            CLIPPORTALVERTS: 41,
            CUBEMAPS: 42,
            TEXDATA_STRING_DATA: 43,
            TEXDATA_STRING_TABLE: 44,
            OVERLAYS: 45,
            LEAFMINDISTTOWATER: 46,
            FACE_MACRO_TEXTURE_INFO: 47,
            DISP_TRIS: 48,
            PHYSCOLLIDESURFACE: 49,
            PROP_BLOB: 49,
            WATEROVERLAYS: 50,
            LIGHTMAPPAGES: 51,
            LEAF_AMBIENT_INDEX_HDR: 51,
            LIGHTMAPPAGEINFOS: 52,
            LEAF_AMBIENT_INDEX: 52,
            LIGHTING_HDR: 53,
            WORLDLIGHTS_HDR: 54,
            LEAF_AMBIENT_LIGHTING_HDR: 55,
            LEAF_AMBIENT_LIGHTING: 56,
            XZIPPAKFILE: 57,
            FACES_HDR: 58,
            MAP_FLAGS: 59,
            OVERLAY_FADES: 60,
            OVERLAY_SYSTEM_LEVELS: 61,
            PHYSLEVEL: 62,
            DISP_MULTIBLEND: 63,
        }
    }

    static get FILE_HEADER_BYTE_LENGTH() {
        return 1036;
    }

    static get HEADER_LUMPS() {
        return 64;
    }

    static readHeader(headerView) {

        const dheader_t = {
            indent: null,
            version: null,
            lumps: null,
            mapRevision: null,
        }

        const indentBytes = Uint32ToBytes(headerView[0]);
        const indentString = String.fromCharCode(...indentBytes);

        dheader_t.indent = indentString;
        dheader_t.version = headerView[1];
        dheader_t.lumps = [];

        const lumpsStartIndex = 2;
        const lumpByteSize = 16;

        for(let i = 0; i < BSPFile.HEADER_LUMPS; i++) {

            const sliceOffset = lumpsStartIndex + (i * (lumpByteSize / 4));

            const lump = headerView.slice(sliceOffset, sliceOffset + 4);

            const lump_t = {
                fileofs: lump[0],
                filelen: lump[1],
                version : lump[2],
                fourCC: Uint32ToBytes(lump[3]),
            }

            dheader_t.lumps.push(lump_t);
        }

        const revisionStartIndex = lumpsStartIndex + BSPFile.HEADER_LUMPS * (lumpByteSize / 4);

        dheader_t.mapRevision = headerView[revisionStartIndex];

        return dheader_t;
    }

    static verifyHeader(header) {
        if(this.known_types.indexOf(header.indent) == -1) {
            throw new Error('Uknown bsp type');
        }
        if(header.version > this.supported_version) {
            throw new Error('Unknown bsp version');
        }
    }

    static readLumpData(lumps, dataArray) {
        const lumpsData = [];

        for(let lump of lumps) {
            const lumpLength = lump.filelen;
            const lumpOffset = lump.fileofs;
            
            const lumpData = new Uint8Array(dataArray.slice(lumpOffset, lumpOffset + lumpLength));
            lumpsData.push(lumpData);
        }

        return lumpsData;
    }

    static parseStruct(byteArray, struct) {

        let byteIndex = 0;
        let structData = {};

        const parseBytes = type => {
            let data = null;

            switch (type.toLocaleLowerCase()) {
                case 'int': {
                    const typeByteSize = 4;
                    const bytes = byteArray.slice(byteIndex, byteIndex + typeByteSize);
                    data = bytesToInteger(bytes);
                    byteIndex += typeByteSize;
                    break;
                }
                case 'unsigned int': {
                    const typeByteSize = 4;
                    const bytes = byteArray.slice(byteIndex, byteIndex + typeByteSize)
                    data = bytesToInteger(bytes);
                    byteIndex += typeByteSize;
                    break;
                }
                case 'float': {
                    const typeByteSize = 4;
                    const bytes = byteArray.slice(byteIndex, byteIndex + typeByteSize)
                    data = bytesToFloat(bytes);
                    byteIndex += typeByteSize;
                    break;
                }
                case 'vector': {
                    const typeByteSize = 4;
                    
                    data = [];

                    for(let i = 0; i < 3; i++) {
                        const bytes = byteArray.slice(
                            byteIndex + (i * typeByteSize), 
                            byteIndex + (i * typeByteSize) + typeByteSize
                        );
                        data[i] = bytesToFloat(bytes);
                    }
                    
                    byteIndex += typeByteSize;
                    break;
                }
                case 'short': {
                    const typeByteSize = 2;
                    const bytes = byteArray.slice(byteIndex, byteIndex + typeByteSize)
                    data = bytesToShort(bytes);
                    byteIndex += typeByteSize;
                    break;
                }
                case 'unsigned short': {
                    const typeByteSize = 2;
                    const bytes = byteArray.slice(byteIndex, byteIndex + typeByteSize)
                    data = bytesToShort(bytes);
                    byteIndex += typeByteSize;
                    break;
                }
                case 'byte': {
                    const typeByteSize = 1;
                    const bytes = byteArray.slice(byteIndex, byteIndex + typeByteSize)
                    data = bytes[0];
                    byteIndex += typeByteSize;
                    break;
                }
                default:
                    throw new Error('Unknown data type "' + type + '"');
            }

            return data;
        }

        for(let key in struct) {
            const type = struct[key];
            const isArray = type[type.length-1] == "]";
            
            if(isArray) {
                const arrayData = [];
                const arrayIdentifier = type.match(/\[[0-9]+\]/g)[0];
                const arrayLength = parseInt(arrayIdentifier.replace(/(\[|\]])/g, ''));
                const arrayDataType = type.replace(arrayIdentifier, '');

                for(let i = 0; i < arrayLength; i++) {
                    arrayData[i] = parseBytes(arrayDataType);
                }

                structData[key] = arrayData;
            } else {
                structData[key] = parseBytes(type);
            }
        }

        return {
            byteSize: byteIndex,
            data: structData
        };
    }

    static parseLump(lumpByteArray, struct) {
        const structs = [];

        const lumpByteSize = lumpByteArray.length;

        let lastByteOffset = 0;
        let guessByteSize = 255;

        while(lastByteOffset < lumpByteArray.length) {
            const byteArray = lumpByteArray.slice(lastByteOffset, lastByteOffset + guessByteSize);
            const structData = this.parseStruct(byteArray, struct);

            guessByteSize = structData.byteSize;
            lastByteOffset += structData.byteSize;

            structs.push(structData.data);
        }

        return structs;
    }

    static fromDataArray(dataArray) {
        const bsp = new BSPFile();

        const headerView = new Uint32Array(dataArray.slice(0, BSPFile.FILE_HEADER_BYTE_LENGTH));

        bsp.header = BSPFile.readHeader(headerView);

        try {
            BSPFile.verifyHeader(bsp.header);
        } catch(err) {
            throw err;
        }

        const lumps = BSPFile.readLumpData(bsp.header.lumps, dataArray);

        bsp.faces = BSPFile.parseLump(lumps[BSPFile.LUMP.FACES], BSPFile.STRUCT.dface_t);
        bsp.planes = BSPFile.parseLump(lumps[BSPFile.LUMP.PLANES], BSPFile.STRUCT.dplane_t);
        bsp.edges = BSPFile.parseLump(lumps[BSPFile.LUMP.EDGES], BSPFile.STRUCT.dedge_t);
        bsp.vertecies = BSPFile.parseLump(lumps[BSPFile.LUMP.VERTEXES], BSPFile.STRUCT.vertex);

        return bsp;
    }

}
